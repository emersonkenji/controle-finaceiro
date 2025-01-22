<?php

namespace App\Jobs;

use App\Models\Report;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GenerateReport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $report;

    public function __construct(Report $report)
    {
        $this->report = $report;
    }

    public function handle()
    {
        try {
            // Atualiza o status para processando
            $this->report->update(['status' => 'processing']);

            // Gera os dados do relatório baseado no template
            $data = match($this->report->template->type) {
                'financial' => $this->generateFinancialReport(),
                'sales' => $this->generateSalesReport(),
                'inventory' => $this->generateInventoryReport(),
                'performance' => $this->generatePerformanceReport(),
                default => []
            };

            // Atualiza o relatório com os dados gerados
            $this->report->update([
                'data' => $data,
                'status' => 'ready'
            ]);
        } catch (\Exception $e) {
            // Em caso de erro, atualiza o status
            $this->report->update(['status' => 'error']);

            // Loga o erro
            Log::error('Erro ao gerar relatório: ' . $e->getMessage(), [
                'report_id' => $this->report->id,
                'template_type' => $this->report->template->type,
                'error' => $e->getMessage()
            ]);
        }
    }

    protected function generateFinancialReport()
    {
        $period = $this->report->period;
        $filters = $this->report->filters ?? [];

        $query = DB::table('transactions')
            ->select(
                DB::raw('SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) as total_income'),
                DB::raw('SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) as total_expenses'),
                DB::raw('SUM(CASE WHEN type = "income" THEN amount ELSE -amount END) as profit'),
                'categories.name as category',
                'cost_centers.name as cost_center'
            )
            ->join('transaction_categories as categories', 'transactions.category_id', '=', 'categories.id')
            ->leftJoin('cost_centers', 'transactions.cost_center_id', '=', 'cost_centers.id')
            ->where('transactions.status', 'completed')
            ->when($period === 'month', function ($query) {
                $query->whereMonth('transactions.date', now()->month)
                    ->whereYear('transactions.date', now()->year);
            })
            ->when($period === 'quarter', function ($query) {
                $query->whereQuarter('transactions.date', now()->quarter)
                    ->whereYear('transactions.date', now()->year);
            })
            ->when($period === 'year', function ($query) {
                $query->whereYear('transactions.date', now()->year);
            })
            ->when(!empty($filters['category_id']), function ($query) use ($filters) {
                $query->where('transactions.category_id', $filters['category_id']);
            })
            ->when(!empty($filters['cost_center_id']), function ($query) use ($filters) {
                $query->where('transactions.cost_center_id', $filters['cost_center_id']);
            })
            ->groupBy('categories.name', 'cost_centers.name')
            ->get();

        return [
            'summary' => [
                'total_income' => $query->sum('total_income'),
                'total_expenses' => $query->sum('total_expenses'),
                'profit' => $query->sum('profit')
            ],
            'by_category' => $query->groupBy('category')->map(function ($items) {
                return [
                    'income' => $items->sum('total_income'),
                    'expenses' => $items->sum('total_expenses'),
                    'profit' => $items->sum('profit')
                ];
            }),
            'by_cost_center' => $query->groupBy('cost_center')->map(function ($items) {
                return [
                    'income' => $items->sum('total_income'),
                    'expenses' => $items->sum('total_expenses'),
                    'profit' => $items->sum('profit')
                ];
            })
        ];
    }

    protected function generateSalesReport()
    {
        $period = $this->report->period;
        $filters = $this->report->filters ?? [];

        $query = DB::table('orders')
            ->select(
                DB::raw('COUNT(*) as total_orders'),
                DB::raw('SUM(total) as total_amount'),
                DB::raw('AVG(total) as average_ticket'),
                'products.name as product',
                'users.name as seller'
            )
            ->join('order_items', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('users', 'orders.user_id', '=', 'users.id')
            ->where('orders.status', 'completed')
            ->when($period === 'month', function ($query) {
                $query->whereMonth('orders.created_at', now()->month)
                    ->whereYear('orders.created_at', now()->year);
            })
            ->when($period === 'quarter', function ($query) {
                $query->whereQuarter('orders.created_at', now()->quarter)
                    ->whereYear('orders.created_at', now()->year);
            })
            ->when($period === 'year', function ($query) {
                $query->whereYear('orders.created_at', now()->year);
            })
            ->when(!empty($filters['product_id']), function ($query) use ($filters) {
                $query->where('order_items.product_id', $filters['product_id']);
            })
            ->when(!empty($filters['seller_id']), function ($query) use ($filters) {
                $query->where('orders.user_id', $filters['seller_id']);
            })
            ->groupBy('products.name', 'users.name')
            ->get();

        return [
            'summary' => [
                'total_orders' => $query->sum('total_orders'),
                'total_amount' => $query->sum('total_amount'),
                'average_ticket' => $query->avg('average_ticket')
            ],
            'by_product' => $query->groupBy('product')->map(function ($items) {
                return [
                    'orders' => $items->sum('total_orders'),
                    'amount' => $items->sum('total_amount')
                ];
            }),
            'by_seller' => $query->groupBy('seller')->map(function ($items) {
                return [
                    'orders' => $items->sum('total_orders'),
                    'amount' => $items->sum('total_amount')
                ];
            })
        ];
    }

    protected function generateInventoryReport()
    {
        $filters = $this->report->filters ?? [];

        $query = DB::table('products')
            ->select(
                'products.name',
                'products.sku',
                'products.stock',
                'products.min_stock',
                'categories.name as category',
                DB::raw('(SELECT COUNT(*) FROM product_stock_movements WHERE product_id = products.id) as movements_count'),
                DB::raw('(SELECT SUM(quantity) FROM product_stock_movements WHERE product_id = products.id AND type = "entrada") as total_in'),
                DB::raw('(SELECT SUM(quantity) FROM product_stock_movements WHERE product_id = products.id AND type = "saida") as total_out')
            )
            ->join('product_categories as categories', 'products.category_id', '=', 'categories.id')
            ->when(!empty($filters['category_id']), function ($query) use ($filters) {
                $query->where('products.category_id', $filters['category_id']);
            })
            ->when(!empty($filters['stock_status']), function ($query) use ($filters) {
                switch ($filters['stock_status']) {
                    case 'low':
                        $query->where('stock', '<=', DB::raw('min_stock'))
                            ->where('stock', '>', 0);
                        break;
                    case 'out':
                        $query->where('stock', '<=', 0);
                        break;
                }
            })
            ->get();

        return [
            'summary' => [
                'total_products' => $query->count(),
                'low_stock' => $query->where('stock', '<=', DB::raw('min_stock'))->where('stock', '>', 0)->count(),
                'out_of_stock' => $query->where('stock', '<=', 0)->count()
            ],
            'by_category' => $query->groupBy('category')->map(function ($items) {
                return [
                    'products' => $items->count(),
                    'total_stock' => $items->sum('stock'),
                    'low_stock' => $items->where('stock', '<=', DB::raw('min_stock'))->where('stock', '>', 0)->count(),
                    'out_of_stock' => $items->where('stock', '<=', 0)->count()
                ];
            }),
            'products' => $query->map(function ($item) {
                return [
                    'name' => $item->name,
                    'sku' => $item->sku,
                    'stock' => $item->stock,
                    'min_stock' => $item->min_stock,
                    'category' => $item->category,
                    'movements' => [
                        'count' => $item->movements_count,
                        'in' => $item->total_in,
                        'out' => $item->total_out
                    ]
                ];
            })
        ];
    }

    protected function generatePerformanceReport()
    {
        $period = $this->report->period;
        $filters = $this->report->filters ?? [];

        $query = DB::table('users')
            ->select(
                'users.name',
                DB::raw('COUNT(DISTINCT orders.id) as total_orders'),
                DB::raw('SUM(orders.total) as total_sales'),
                DB::raw('SUM(commissions.amount) as total_commission'),
                DB::raw('AVG(orders.total) as average_ticket')
            )
            ->join('orders', 'users.id', '=', 'orders.user_id')
            ->leftJoin('commissions', 'orders.id', '=', 'commissions.order_id')
            ->where('orders.status', 'completed')
            ->when($period === 'month', function ($query) {
                $query->whereMonth('orders.created_at', now()->month)
                    ->whereYear('orders.created_at', now()->year);
            })
            ->when($period === 'quarter', function ($query) {
                $query->whereQuarter('orders.created_at', now()->quarter)
                    ->whereYear('orders.created_at', now()->year);
            })
            ->when($period === 'year', function ($query) {
                $query->whereYear('orders.created_at', now()->year);
            })
            ->when(!empty($filters['user_id']), function ($query) use ($filters) {
                $query->where('users.id', $filters['user_id']);
            })
            ->groupBy('users.name')
            ->get();

        return [
            'summary' => [
                'total_orders' => $query->sum('total_orders'),
                'total_sales' => $query->sum('total_sales'),
                'total_commission' => $query->sum('total_commission'),
                'average_ticket' => $query->avg('average_ticket')
            ],
            'by_seller' => $query->map(function ($item) {
                return [
                    'name' => $item->name,
                    'orders' => $item->total_orders,
                    'sales' => $item->total_sales,
                    'commission' => $item->total_commission,
                    'average_ticket' => $item->average_ticket
                ];
            })
        ];
    }
}
