<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\ReportTemplate;
use App\Jobs\GenerateReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Writer\Pdf;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Report::with(['template', 'user'])
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($request->template_id, function ($query, $templateId) {
                $query->where('template_id', $templateId);
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->period, function ($query, $period) {
                $query->where('period', $period);
            });

        $reports = $query->orderBy($request->sort_field ?? 'created_at', $request->sort_direction ?? 'desc')
            ->paginate(10)
            ->withQueryString();

        $templates = ReportTemplate::all();

        return Inertia::render('Reports/Index', [
            'reports' => $reports,
            'templates' => $templates,
            'filters' => $request->all(['search', 'template_id', 'status', 'period', 'sort_field', 'sort_direction'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'template_id' => 'required|exists:report_templates,id',
            'name' => 'required|string|max:255',
            'period' => 'required|string',
            'filters' => 'nullable|array'
        ]);

        DB::beginTransaction();

        try {
            $report = Report::create([
                ...$validated,
                'user_id' => Auth::id(),
                'status' => 'processing'
            ]);

            // Dispara job para gerar o relatório em background
            dispatch(new GenerateReport($report));

            DB::commit();

            return back()->with('success', 'Relatório agendado para geração.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao agendar relatório.');
        }
    }

    public function show(Report $report)
    {
        $report->load(['template', 'user', 'comments.user']);

        // Carrega os dados do relatório baseado no template
        $data = $this->generateReportData($report);

        return Inertia::render('Reports/Show', [
            'report' => $report,
            'data' => $data
        ]);
    }

    public function download(Report $report, Request $request)
    {
        if ($report->status !== 'ready') {
            return back()->with('error', 'Relatório ainda não está pronto para download.');
        }

        $format = $request->format ?? 'pdf';
        $data = $this->generateReportData($report);

        switch ($format) {
            case 'xlsx':
                return $this->downloadExcel($report, $data);
            case 'pdf':
                return $this->downloadPdf($report, $data);
            default:
                return back()->with('error', 'Formato não suportado.');
        }
    }

    protected function generateReportData(Report $report)
    {
        // Gera os dados do relatório baseado no template
        switch ($report->template->type) {
            case 'financial':
                return $this->generateFinancialReport($report);
            case 'sales':
                return $this->generateSalesReport($report);
            case 'inventory':
                return $this->generateInventoryReport($report);
            case 'performance':
                return $this->generatePerformanceReport($report);
            default:
                return [];
        }
    }

    protected function generateFinancialReport(Report $report)
    {
        $period = $report->period;
        $filters = $report->filters ?? [];

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

    protected function generateSalesReport(Report $report)
    {
        $period = $report->period;
        $filters = $report->filters ?? [];

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

    protected function generateInventoryReport(Report $report)
    {
        $filters = $report->filters ?? [];

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

    protected function generatePerformanceReport(Report $report)
    {
        $period = $report->period;
        $filters = $report->filters ?? [];

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

    protected function downloadExcel(Report $report, array $data)
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Configuração do cabeçalho
        $sheet->setCellValue('A1', $report->name);
        $sheet->setCellValue('A2', 'Período: ' . $report->period);
        $sheet->setCellValue('A3', 'Gerado em: ' . now()->format('d/m/Y H:i:s'));

        // Adiciona os dados específicos do relatório
        $this->addReportDataToSheet($sheet, $data, $report->template->type);

        // Configurações de estilo
        $this->applyExcelStyles($sheet);

        // Gera o arquivo
        $writer = new Xlsx($spreadsheet);
        $filename = Str::slug($report->name) . '_' . date('Y-m-d_His') . '.xlsx';
        $path = storage_path('app/public/reports/' . $filename);

        if (!file_exists(storage_path('app/public/reports'))) {
            mkdir(storage_path('app/public/reports'), 0755, true);
        }

        $writer->save($path);

        return response()->download($path)->deleteFileAfterSend();
    }

    protected function downloadPdf(Report $report, array $data)
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Configuração do cabeçalho
        $sheet->setCellValue('A1', $report->name);
        $sheet->setCellValue('A2', 'Período: ' . $report->period);
        $sheet->setCellValue('A3', 'Gerado em: ' . now()->format('d/m/Y H:i:s'));

        // Adiciona os dados específicos do relatório
        $this->addReportDataToSheet($sheet, $data, $report->template->type);

        // Configurações de estilo
        $this->applyExcelStyles($sheet);

        // Gera o arquivo PDF
        $writer = new Pdf($spreadsheet);
        $filename = Str::slug($report->name) . '_' . date('Y-m-d_His') . '.pdf';
        $path = storage_path('app/public/reports/' . $filename);

        if (!file_exists(storage_path('app/public/reports'))) {
            mkdir(storage_path('app/public/reports'), 0755, true);
        }

        $writer->save($path);

        return response()->download($path)->deleteFileAfterSend();
    }

    protected function addReportDataToSheet($sheet, array $data, string $type)
    {
        switch ($type) {
            case 'financial':
                $this->addFinancialDataToSheet($sheet, $data);
                break;
            case 'sales':
                $this->addSalesDataToSheet($sheet, $data);
                break;
            case 'inventory':
                $this->addInventoryDataToSheet($sheet, $data);
                break;
            case 'performance':
                $this->addPerformanceDataToSheet($sheet, $data);
                break;
        }
    }

    protected function applyExcelStyles($sheet)
    {
        // Estilo do cabeçalho
        $sheet->getStyle('A1:Z1')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 14
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER
            ]
        ]);

        // Estilo das células de dados
        $sheet->getStyle('A2:Z' . $sheet->getHighestRow())->applyFromArray([
            'alignment' => [
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER
            ]
        ]);

        // Autosize para todas as colunas
        foreach (range('A', $sheet->getHighestColumn()) as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }
    }
}
