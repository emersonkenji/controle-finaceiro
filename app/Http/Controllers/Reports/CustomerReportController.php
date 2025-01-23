<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class CustomerReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::query()
            ->withCount('orders')
            ->withSum('orders', 'total_amount')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('document', 'like', "%{$search}%");
                });
            })
            ->when($request->category_id, function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            });

        // Top produtos mais comprados por cliente
        $topProducts = Order::query()
            ->join('order_items', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->select(
                'orders.customer_id',
                'products.name as product_name',
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.total) as total_amount')
            )
            ->groupBy('orders.customer_id', 'products.id', 'products.name')
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->get()
            ->groupBy('customer_id');

        $customers = $query->latest()->paginate(10);

        return Inertia::render('Reports/Customers/Index', [
            'customers' => $customers,
            'topProducts' => $topProducts,
            'filters' => $request->only(['search', 'category_id'])
        ]);
    }
}
