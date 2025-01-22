<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\TransactionCategory;
use App\Models\CostCenter;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with(['category', 'costCenter'])
            ->when($request->search, function ($query, $search) {
                $query->where('description', 'like', "%{$search}%");
            })
            ->when($request->type, function ($query, $type) {
                $query->where('type', $type);
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->category_id, function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->when($request->cost_center_id, function ($query, $costCenterId) {
                $query->where('cost_center_id', $costCenterId);
            })
            ->when($request->start_date, function ($query, $startDate) {
                $query->where('due_date', '>=', $startDate);
            })
            ->when($request->end_date, function ($query, $endDate) {
                $query->where('due_date', '<=', $endDate);
            });

        $transactions = $query->orderBy($request->sort_field ?? 'due_date', $request->sort_direction ?? 'desc')
            ->paginate(10)
            ->withQueryString();

        $categories = TransactionCategory::active()->get();
        $costCenters = CostCenter::active()->get();

        return Inertia::render('Financial/Transactions/Index', [
            'transactions' => $transactions,
            'categories' => $categories,
            'costCenters' => $costCenters,
            'filters' => $request->all(['search', 'type', 'status', 'category_id', 'cost_center_id', 'start_date', 'end_date'])
        ]);
    }

    public function create()
    {
        $categories = TransactionCategory::active()->get();
        $costCenters = CostCenter::active()->get();

        return Inertia::render('Financial/Transactions/Form', [
            'categories' => $categories,
            'costCenters' => $costCenters
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:receivable,payable',
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'due_date' => 'required|date',
            'payment_date' => 'nullable|date',
            'status' => 'required|in:pending,paid,cancelled',
            'payment_method' => 'nullable|string|max:50',
            'category_id' => 'required|exists:transaction_categories,id',
            'cost_center_id' => 'nullable|exists:cost_centers,id',
            'reference' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
            'document_number' => 'nullable|string|max:50',
            'installment_number' => 'nullable|integer|min:1',
            'total_installments' => 'nullable|integer|min:1',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|max:10240'
        ]);

        DB::beginTransaction();

        try {
            $transaction = Transaction::create($validated);

            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('attachments/transactions/' . $transaction->id);

                    $transaction->attachments()->create([
                        'name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'mime_type' => $file->getMimeType(),
                        'size' => $file->getSize(),
                        'user_id' => Auth::id()
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('financial.transactions.index')
                ->with('success', 'Transação criada com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao criar transação.');
        }
    }

    public function edit(Transaction $transaction)
    {
        $transaction->load(['attachments']);
        $categories = TransactionCategory::active()->get();
        $costCenters = CostCenter::active()->get();

        return Inertia::render('Financial/Transactions/Form', [
            'transaction' => $transaction,
            'categories' => $categories,
            'costCenters' => $costCenters
        ]);
    }

    public function update(Request $request, Transaction $transaction)
    {
        $validated = $request->validate([
            'type' => 'required|in:receivable,payable',
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'due_date' => 'required|date',
            'payment_date' => 'nullable|date',
            'status' => 'required|in:pending,paid,cancelled',
            'payment_method' => 'nullable|string|max:50',
            'category_id' => 'required|exists:transaction_categories,id',
            'cost_center_id' => 'nullable|exists:cost_centers,id',
            'reference' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
            'document_number' => 'nullable|string|max:50',
            'installment_number' => 'nullable|integer|min:1',
            'total_installments' => 'nullable|integer|min:1',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|max:10240'
        ]);

        DB::beginTransaction();

        try {
            $transaction->update($validated);

            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('attachments/transactions/' . $transaction->id);

                    $transaction->attachments()->create([
                        'name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'mime_type' => $file->getMimeType(),
                        'size' => $file->getSize(),
                        'user_id' => Auth::id()
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('financial.transactions.index')
                ->with('success', 'Transação atualizada com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao atualizar transação.');
        }
    }

    public function destroy(Transaction $transaction)
    {
        DB::beginTransaction();

        try {
            foreach ($transaction->attachments as $attachment) {
                Storage::delete($attachment->path);
                $attachment->delete();
            }

            $transaction->delete();

            DB::commit();

            return redirect()->route('financial.transactions.index')
                ->with('success', 'Transação excluída com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao excluir transação.');
        }
    }
}
