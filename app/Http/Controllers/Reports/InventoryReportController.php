<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()
            ->with(['category'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%");
                });
            })
            ->when($request->category_id, function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->when($request->stock_status, function ($query, $status) {
                switch ($status) {
                    case 'low':
                        $query->whereColumn('stock', '<=', 'min_stock');
                        break;
                    case 'out':
                        $query->where('stock', '<=', 0);
                        break;
                }
            });

        $totals = [
            'total_products' => $query->count(),
            'total_value' => $query->sum(\DB::raw('stock * cost')),
            'low_stock' => $query->clone()->whereColumn('stock', '<=', 'min_stock')->count(),
            'out_of_stock' => $query->clone()->where('stock', '<=', 0)->count()
        ];

        $products = $query->latest()->paginate(10);

        return Inertia::render('Reports/Inventory/Index', [
            'products' => $products,
            'totals' => $totals,
            'filters' => $request->only(['search', 'category_id', 'stock_status'])
        ]);
    }
}
