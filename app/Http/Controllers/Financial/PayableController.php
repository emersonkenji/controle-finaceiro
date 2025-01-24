<?php

namespace App\Http\Controllers\Financial;

use Inertia\Inertia;
use App\Models\CostCenter;
use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\TransactionCategory as Category;

class PayableController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::query()
            ->where('type', 'payable')
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

        $payables = $query->paginate(10);

        return Inertia::render('Financial/Payables/Index', [
            'payables' => $payables,
            'filters' => $request->only(['search', 'status', 'sort_field', 'sort_direction']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Financial/Payables/Form', [
            'categories' => Category::where('type', 'payable')->get(),
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
            'type' => 'payable',
            'status' => 'pending',
        ]);

        return redirect()->route('financial.payables.index')
            ->with('success', 'Conta a pagar cadastrada com sucesso.');
    }

    public function edit(Transaction $payable)
    {
        return Inertia::render('Financial/Payables/Form', [
            'payable' => $payable->load(['category', 'costCenter']),
            'categories' => Category::where('type', 'payable')->get(),
            'costCenters' => CostCenter::all(),
        ]);
    }

    public function update(Request $request, Transaction $payable)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'due_date' => 'required|date',
            'category_id' => 'required|exists:categories,id',
            'cost_center_id' => 'required|exists:cost_centers,id',
            'notes' => 'nullable|string',
        ]);

        $payable->update([
            'description' => $validated['description'],
            'amount' => $validated['amount'],
            'due_date' => $validated['due_date'],
            'category_id' => $validated['category_id'],
            'cost_center_id' => $validated['cost_center_id'],
            'notes' => $validated['notes'],
        ]);

        return redirect()->route('financial.payables.index')
            ->with('success', 'Conta a pagar atualizada com sucesso.');
    }

    public function destroy(Transaction $payable)
    {
        $payable->delete();

        return redirect()->route('financial.payables.index')
            ->with('success', 'Conta a pagar excluída com sucesso.');
    }
}
