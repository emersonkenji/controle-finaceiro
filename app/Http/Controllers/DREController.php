<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DREController extends Controller
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
            });

        $transactions = $query->get();

        $dre = [
            'receitas' => [
                'total' => $transactions->where('type', 'receivable')->sum('amount'),
                'por_categoria' => $transactions->where('type', 'receivable')
                    ->groupBy('category.name')
                    ->map(function ($items) {
                        return $items->sum('amount');
                    })
            ],
            'despesas' => [
                'total' => $transactions->where('type', 'payable')->sum('amount'),
                'por_categoria' => $transactions->where('type', 'payable')
                    ->groupBy('category.name')
                    ->map(function ($items) {
                        return $items->sum('amount');
                    })
            ],
            'resultado' => $transactions->where('type', 'receivable')->sum('amount') -
                          $transactions->where('type', 'payable')->sum('amount')
        ];

        return Inertia::render('Financial/DRE', [
            'dre' => $dre,
            'filters' => $request->only(['start_date', 'end_date'])
        ]);
    }

    public function export(Request $request)
    {
        // Implementar exportação do DRE
        return response()->json(['message' => 'Em desenvolvimento']);
    }
}
