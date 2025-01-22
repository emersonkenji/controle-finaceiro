<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\BankStatement;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BankReconciliationController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::query()
            ->with(['category', 'costCenter'])
            ->when($request->filled('start_date'), function ($query) use ($request) {
                $query->where('due_date', '>=', $request->start_date);
            })
            ->when($request->filled('end_date'), function ($query) use ($request) {
                $query->where('due_date', '<=', $request->end_date);
            })
            ->when($request->filled('reconciled'), function ($query) use ($request) {
                if ($request->reconciled === 'yes') {
                    $query->whereNotNull('reconciled_at');
                } else {
                    $query->whereNull('reconciled_at');
                }
            });

        $transactions = $query->orderBy('due_date')->paginate(10);

        return Inertia::render('Financial/BankReconciliation/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['start_date', 'end_date', 'reconciled'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Financial/BankReconciliation/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'transactions' => 'required|array',
            'transactions.*' => 'exists:transactions,id',
            'reconciliation_date' => 'required|date',
            'notes' => 'nullable|string'
        ]);

        DB::transaction(function () use ($validated) {
            Transaction::whereIn('id', $validated['transactions'])
                ->update([
                    'reconciled_at' => $validated['reconciliation_date'],
                    'notes' => $validated['notes']
                ]);
        });

        return redirect()->route('financial.bank-reconciliation.index')
            ->with('success', 'Transações reconciliadas com sucesso.');
    }

    public function show($id)
    {
        $transaction = Transaction::with(['category', 'costCenter'])->findOrFail($id);

        return Inertia::render('Financial/BankReconciliation/Show', [
            'transaction' => $transaction
        ]);
    }

    public function edit($id)
    {
        $transaction = Transaction::with(['category', 'costCenter'])->findOrFail($id);

        return Inertia::render('Financial/BankReconciliation/Form', [
            'transaction' => $transaction
        ]);
    }

    public function update(Request $request, $id)
    {
        $transaction = Transaction::findOrFail($id);

        $validated = $request->validate([
            'reconciled_at' => 'nullable|date',
            'notes' => 'nullable|string'
        ]);

        $transaction->update($validated);

        return redirect()->route('financial.bank-reconciliation.index')
            ->with('success', 'Reconciliação atualizada com sucesso.');
    }

    public function destroy($id)
    {
        $transaction = Transaction::findOrFail($id);

        $transaction->update([
            'reconciled_at' => null,
            'notes' => null
        ]);

        return redirect()->route('financial.bank-reconciliation.index')
            ->with('success', 'Reconciliação removida com sucesso.');
    }

    public function import(Request $request)
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:csv,txt,ofx',
            'bank' => 'required|string',
            'account' => 'required|string'
        ]);

        try {
            DB::beginTransaction();

            // Aqui você implementaria a lógica de importação do arquivo
            // de acordo com o formato (CSV, OFX) e banco selecionado

            DB::commit();

            return back()->with('success', 'Extrato importado com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao importar extrato: ' . $e->getMessage());
        }
    }

    public function reconcile(Request $request)
    {
        $validated = $request->validate([
            'transaction_id' => 'required|exists:transactions,id',
            'bank_statement_id' => 'required|exists:bank_statements,id'
        ]);

        try {
            DB::beginTransaction();

            $transaction = Transaction::findOrFail($validated['transaction_id']);
            $bankStatement = BankStatement::findOrFail($validated['bank_statement_id']);

            // Verifica se os valores são compatíveis
            if ($transaction->amount != $bankStatement->amount) {
                return back()->with('error', 'Os valores da transação e do extrato são diferentes.');
            }

            // Marca a transação como conciliada
            $transaction->update([
                'bank_reconciliation_id' => $bankStatement->id,
                'reconciled_at' => now()
            ]);

            // Marca o item do extrato como conciliado
            $bankStatement->update([
                'reconciled' => true,
                'transaction_id' => $transaction->id
            ]);

            DB::commit();

            return back()->with('success', 'Transação conciliada com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao conciliar transação: ' . $e->getMessage());
        }
    }
}
