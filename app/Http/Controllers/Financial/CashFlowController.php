<?php

namespace App\Http\Controllers\Financial;

use Inertia\Inertia;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class CashFlowController extends Controller
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
            ->when($request->filled('category_id'), function ($query) use ($request) {
                $query->where('category_id', $request->category_id);
            })
            ->when($request->filled('cost_center_id'), function ($query) use ($request) {
                $query->where('cost_center_id', $request->cost_center_id);
            });

        $transactions = $query->orderBy('due_date')->get();

        $cashFlow = $transactions->groupBy(function ($transaction) {
            return $transaction->due_date->format('Y-m-d');
        })->map(function ($dayTransactions) {
            return [
                'receivables' => $dayTransactions->where('type', 'receivable')->sum('amount'),
                'payables' => $dayTransactions->where('type', 'payable')->sum('amount'),
                'balance' => $dayTransactions->where('type', 'receivable')->sum('amount') -
                           $dayTransactions->where('type', 'payable')->sum('amount')
            ];
        });

        $totals = [
            'receivables' => $transactions->where('type', 'receivable')->sum('amount'),
            'payables' => $transactions->where('type', 'payable')->sum('amount'),
            'balance' => $transactions->where('type', 'receivable')->sum('amount') -
                        $transactions->where('type', 'payable')->sum('amount')
        ];

        return Inertia::render('Financial/CashFlow', [
            'cashFlow' => $cashFlow,
            'totals' => $totals,
            'filters' => $request->only(['start_date', 'end_date', 'category_id', 'cost_center_id'])
        ]);
    }

    public function export(Request $request)
    {
        // Implementar exportação do fluxo de caixa
        return response()->json(['message' => 'Em desenvolvimento']);
    }
}
