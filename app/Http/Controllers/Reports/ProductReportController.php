<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ProductReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()
            ->withCount('orderItems')
            ->withSum('orderItems', 'total')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%");
                });
            })
            ->when($request->category_id, function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            });

        // Produtos mais vendidos
        $topSelling = OrderItem::query()
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->select(
                'products.id',
                'products.name',
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.total) as total_amount')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_quantity')
            ->limit(10)
            ->get();

        // Produtos mais lucrativos
        $mostProfitable = OrderItem::query()
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->select(
                'products.id',
                'products.name',
                DB::raw('SUM(order_items.total - (products.cost * order_items.quantity)) as total_profit'),
                DB::raw('SUM(order_items.total) as total_revenue')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_profit')
            ->limit(10)
            ->get();

        $products = $query->latest()->paginate(10);

        return Inertia::render('Reports/Products/Index', [
            'products' => $products,
            'topSelling' => $topSelling,
            'mostProfitable' => $mostProfitable,
            'filters' => $request->only(['search', 'category_id'])
        ]);
    }
}
