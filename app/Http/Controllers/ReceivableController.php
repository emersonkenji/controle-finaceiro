<?php

namespace App\Http\Controllers;

use App\Models\TransactionCategory as Category;
use App\Models\CostCenter;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ReceivableController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::query()
            ->where('type', 'receivable')
            ->with(['category', 'costCenter']);

        if ($request->filled('search')) {
            $query->where('description', 'like', "%{$request->search}%");
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('sort_field')) {
            $query->orderBy($request->sort_field, $request->sort_direction ?? 'asc');
        } else {
            $query->orderBy('due_date', 'asc');
        }

        $receivables = $query->paginate(10);

        return Inertia::render('Financial/Receivables/Index', [
            'receivables' => $receivables,
            'filters' => $request->only(['search', 'status', 'sort_field', 'sort_direction']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Financial/Receivables/Form', [
            'categories' => Category::where('type', 'receivable')->get(),
            'costCenters' => CostCenter::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'due_date' => 'required|date',
            'category_id' => 'required|exists:categories,id',
            'cost_center_id' => 'required|exists:cost_centers,id',
            'notes' => 'nullable|string',
        ]);

        Transaction::create([
            'description' => $validated['description'],
            'amount' => $validated['amount'],
            'due_date' => $validated['due_date'],
            'category_id' => $validated['category_id'],
            'cost_center_id' => $validated['cost_center_id'],
            'notes' => $validated['notes'],
            'type' => 'receivable',
            'status' => 'pending',
        ]);

        return redirect()->route('financial.receivables.index')
            ->with('success', 'Conta a receber cadastrada com sucesso.');
    }

    public function edit(Transaction $receivable)
    {
        return Inertia::render('Financial/Receivables/Form', [
            'receivable' => $receivable->load(['category', 'costCenter']),
            'categories' => Category::where('type', 'receivable')->get(),
            'costCenters' => CostCenter::all(),
        ]);
    }

    public function update(Request $request, Transaction $receivable)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'due_date' => 'required|date',
            'category_id' => 'required|exists:categories,id',
            'cost_center_id' => 'required|exists:cost_centers,id',
            'notes' => 'nullable|string',
        ]);

        $receivable->update([
            'description' => $validated['description'],
            'amount' => $validated['amount'],
            'due_date' => $validated['due_date'],
            'category_id' => $validated['category_id'],
            'cost_center_id' => $validated['cost_center_id'],
            'notes' => $validated['notes'],
        ]);

        return redirect()->route('financial.receivables.index')
            ->with('success', 'Conta a receber atualizada com sucesso.');
    }

    public function destroy(Transaction $receivable)
    {
        if ($receivable->status !== 'pending') {
            return back()->with('error', 'Não é possível excluir uma conta a receber que não está pendente.');
        }

        foreach ($receivable->attachments as $attachment) {
            Storage::delete($attachment->path);
            $attachment->delete();
        }

        $receivable->delete();

        return redirect()->route('financial.receivables.index')
            ->with('success', 'Conta a receber excluída com sucesso.');
    }
}
