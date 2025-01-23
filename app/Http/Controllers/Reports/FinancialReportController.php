<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinancialReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::query()
            ->with(['category', 'costCenter'])
            ->when($request->start_date, function ($query, $date) {
                $query->whereDate('due_date', '>=', $date);
            })
            ->when($request->end_date, function ($query, $date) {
                $query->whereDate('due_date', '<=', $date);
            })
            ->when($request->type, function ($query, $type) {
                if ($type !== 'all') {
                    $query->where('type', $type);
                }
            })
            ->when($request->status, function ($query, $status) {
                if ($status !== 'all') {
                    $query->where('status', $status);
                }
            })
            ->when($request->category_id, function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->when($request->cost_center_id, function ($query, $costCenterId) {
                $query->where('cost_center_id', $costCenterId);
            });

        $totals = [
            'receivables' => $query->clone()->where('type', 'receivable')->sum('amount'),
            'payables' => $query->clone()->where('type', 'payable')->sum('amount'),
            'balance' => $query->clone()->where('type', 'receivable')->sum('amount') - $query->clone()->where('type', 'payable')->sum('amount')
        ];

        $transactions = $query->latest()->paginate(10);

        return Inertia::render('Reports/Financial/Index', [
            'transactions' => $transactions,
            'totals' => $totals,
            'filters' => $request->only(['start_date', 'end_date', 'type', 'status', 'category_id', 'cost_center_id'])
        ]);
    }
}
