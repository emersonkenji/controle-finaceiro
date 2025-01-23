<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::query()
            ->with(['customer', 'items.product'])
            ->when($request->start_date, function ($query, $date) {
                $query->whereDate('created_at', '>=', $date);
            })
            ->when($request->end_date, function ($query, $date) {
                $query->whereDate('created_at', '<=', $date);
            })
            ->when($request->customer_id, function ($query, $customerId) {
                $query->where('customer_id', $customerId);
            })
            ->when($request->status, function ($query, $status) {
                if ($status !== 'all') {
                    $query->where('status', $status);
                }
            });

        $totals = [
            'count' => $query->count(),
            'amount' => $query->sum('total_amount'),
            'profit' => $query->sum('profit'),
        ];

        $sales = $query->latest()->paginate(10);

        return Inertia::render('Reports/Sales/Index', [
            'sales' => $sales,
            'totals' => $totals,
            'filters' => $request->only(['start_date', 'end_date', 'customer_id', 'status'])
        ]);
    }
}
