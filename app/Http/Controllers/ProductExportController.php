<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ProductExportController extends Controller
{
    public function __invoke(Request $request)
    {
        $query = Product::query()
            ->with(['category', 'variations'])
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('barcode', 'like', "%{$search}%");
            })
            ->when($request->category, function ($query, $category) {
                $query->where('category_id', $category);
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy($request->sort ?? 'name', $request->direction ?? 'asc');

        $products = $query->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Cabeçalho
        $sheet->setCellValue('A1', 'SKU');
        $sheet->setCellValue('B1', 'Nome');
        $sheet->setCellValue('C1', 'Categoria');
        $sheet->setCellValue('D1', 'Preço');
        $sheet->setCellValue('E1', 'Custo');
        $sheet->setCellValue('F1', 'Estoque');
        $sheet->setCellValue('G1', 'Estoque Mínimo');
        $sheet->setCellValue('H1', 'Status');
        $sheet->setCellValue('I1', 'Código de Barras');
        $sheet->setCellValue('J1', 'Peso (kg)');
        $sheet->setCellValue('K1', 'Dimensões (cm)');
        $sheet->setCellValue('L1', 'Variações');

        // Estilo do cabeçalho
        $sheet->getStyle('A1:L1')->getFont()->setBold(true);
        $sheet->getStyle('A1:L1')->getFill()
            ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
            ->getStartColor()->setRGB('E5E7EB');

        // Dados
        $row = 2;
        foreach ($products as $product) {
            $sheet->setCellValue('A' . $row, $product->sku);
            $sheet->setCellValue('B' . $row, $product->name);
            $sheet->setCellValue('C' . $row, $product->category->name);
            $sheet->setCellValue('D' . $row, $product->price);
            $sheet->setCellValue('E' . $row, $product->cost_price);
            $sheet->setCellValue('F' . $row, $product->stock);
            $sheet->setCellValue('G' . $row, $product->min_stock);
            $sheet->setCellValue('H' . $row, $product->status === 'active' ? 'Ativo' : 'Inativo');
            $sheet->setCellValue('I' . $row, $product->barcode);
            $sheet->setCellValue('J' . $row, $product->weight);
            $sheet->setCellValue('K' . $row, "{$product->height}x{$product->width}x{$product->length}");

            // Variações
            $variations = $product->variations->map(function ($variation) {
                return "{$variation->name} (SKU: {$variation->sku}, Estoque: {$variation->stock})";
            })->join("\n");
            $sheet->setCellValue('L' . $row, $variations);

            $row++;
        }

        // Autosize columns
        foreach (range('A', 'L') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Formatar células de preço
        $sheet->getStyle('D2:E' . ($row - 1))
            ->getNumberFormat()
            ->setFormatCode('R$ #,##0.00');

        // Alinhar células
        $sheet->getStyle('A1:L' . ($row - 1))
            ->getAlignment()
            ->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);

        // Bordas
        $sheet->getStyle('A1:L' . ($row - 1))
            ->getBorders()
            ->getAllBorders()
            ->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

        // Gerar arquivo
        $writer = new Xlsx($spreadsheet);
        $filename = 'produtos_' . date('Y-m-d_His') . '.xlsx';
        $path = storage_path('app/public/exports/' . $filename);

        // Criar diretório se não existir
        if (!file_exists(storage_path('app/public/exports'))) {
            mkdir(storage_path('app/public/exports'), 0755, true);
        }

        $writer->save($path);

        return response()->download($path)->deleteFileAfterSend();
    }
}
