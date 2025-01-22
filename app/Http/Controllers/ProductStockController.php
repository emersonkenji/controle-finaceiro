<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVariation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductStockController extends Controller
{
    public function index(Product $product)
    {
        $product->load([
            'variations',
            'stockMovements' => fn($query) => $query->with('user')->latest()->take(10),
            'variations.stockMovements' => fn($query) => $query->with('user')->latest()->take(10)
        ]);

        return Inertia::render('Products/Stock/Index', [
            'product' => $product,
            'stockAlerts' => [
                'lowStock' => $product->stock <= $product->min_stock,
                'outOfStock' => $product->stock <= 0,
                'variationsLowStock' => $product->variations()
                    ->where('stock', '<=', DB::raw('min_stock'))
                    ->get(),
                'variationsOutOfStock' => $product->variations()
                    ->where('stock', '<=', 0)
                    ->get()
            ]
        ]);
    }

    public function adjust(Request $request, Product $product)
    {
        $validated = $request->validate([
            'type' => 'required|in:entrada,saida,ajuste',
            'quantity' => 'required|numeric|min:0.01',
            'variation_id' => 'nullable|exists:product_variations,id',
            'unit_cost' => 'nullable|numeric|min:0',
            'reference_type' => 'nullable|string',
            'reference_id' => 'nullable|integer',
            'description' => 'required|string'
        ]);

        DB::beginTransaction();

        try {
            if ($validated['variation_id']) {
                $variation = ProductVariation::findOrFail($validated['variation_id']);

                // Verifica se há estoque suficiente para saída
                if ($validated['type'] === 'saida' && $variation->stock < $validated['quantity']) {
                    return back()->with('error', 'Estoque insuficiente para esta variação.');
                }

                // Atualiza o estoque da variação
                $newStock = match($validated['type']) {
                    'entrada' => $variation->stock + $validated['quantity'],
                    'saida' => $variation->stock - $validated['quantity'],
                    'ajuste' => $validated['quantity']
                };

                $variation->update(['stock' => $newStock]);

                // Registra o movimento
                $variation->stockMovements()->create([
                    'type' => $validated['type'],
                    'quantity' => $validated['quantity'],
                    'unit_cost' => $validated['unit_cost'],
                    'reference_type' => $validated['reference_type'],
                    'reference_id' => $validated['reference_id'],
                    'description' => $validated['description'],
                    'user_id' => Auth::id()
                ]);
            } else {
                // Verifica se há estoque suficiente para saída
                if ($validated['type'] === 'saida' && $product->stock < $validated['quantity']) {
                    return back()->with('error', 'Estoque insuficiente.');
                }

                // Atualiza o estoque do produto
                $newStock = match($validated['type']) {
                    'entrada' => $product->stock + $validated['quantity'],
                    'saida' => $product->stock - $validated['quantity'],
                    'ajuste' => $validated['quantity']
                };

                $product->update(['stock' => $newStock]);

                // Registra o movimento
                $product->stockMovements()->create([
                    'type' => $validated['type'],
                    'quantity' => $validated['quantity'],
                    'unit_cost' => $validated['unit_cost'],
                    'reference_type' => $validated['reference_type'],
                    'reference_id' => $validated['reference_id'],
                    'description' => $validated['description'],
                    'user_id' => Auth::id()
                ]);
            }

            DB::commit();

            return back()->with('success', 'Estoque ajustado com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao ajustar estoque.');
        }
    }

    public function history(Product $product)
    {
        $movements = $product->stockMovements()
            ->with(['user', 'variation'])
            ->union(
                $product->variations()
                    ->join('product_stock_movements', 'product_variations.id', '=', 'product_stock_movements.product_variation_id')
                    ->select('product_stock_movements.*')
            )
            ->orderByDesc('created_at')
            ->paginate(20);

        return Inertia::render('Products/Stock/History', [
            'product' => $product,
            'movements' => $movements
        ]);
    }

    public function alerts()
    {
        $lowStock = Product::where('stock', '<=', DB::raw('min_stock'))
            ->where('stock', '>', 0)
            ->with('category')
            ->get();

        $outOfStock = Product::where('stock', '<=', 0)
            ->with('category')
            ->get();

        $variationsLowStock = ProductVariation::where('stock', '<=', DB::raw('min_stock'))
            ->where('stock', '>', 0)
            ->with(['product', 'product.category'])
            ->get();

        $variationsOutOfStock = ProductVariation::where('stock', '<=', 0)
            ->with(['product', 'product.category'])
            ->get();

        return Inertia::render('Products/Stock/Alerts', [
            'alerts' => [
                'lowStock' => $lowStock,
                'outOfStock' => $outOfStock,
                'variationsLowStock' => $variationsLowStock,
                'variationsOutOfStock' => $variationsOutOfStock
            ]
        ]);
    }

    public function transfer(Request $request)
    {
        $validated = $request->validate([
            'from_variation_id' => 'required|exists:product_variations,id',
            'to_variation_id' => 'required|exists:product_variations,id|different:from_variation_id',
            'quantity' => 'required|numeric|min:0.01',
            'description' => 'required|string'
        ]);

        DB::beginTransaction();

        try {
            $fromVariation = ProductVariation::findOrFail($validated['from_variation_id']);
            $toVariation = ProductVariation::findOrFail($validated['to_variation_id']);

            // Verifica se há estoque suficiente
            if ($fromVariation->stock < $validated['quantity']) {
                return back()->with('error', 'Estoque insuficiente na variação de origem.');
            }

            // Atualiza os estoques
            $fromVariation->decrement('stock', $validated['quantity']);
            $toVariation->increment('stock', $validated['quantity']);

            // Registra os movimentos
            $fromVariation->stockMovements()->create([
                'type' => 'saida',
                'quantity' => $validated['quantity'],
                'reference_type' => 'transfer',
                'reference_id' => $toVariation->id,
                'description' => $validated['description'],
                'user_id' => Auth::id()
            ]);

            $toVariation->stockMovements()->create([
                'type' => 'entrada',
                'quantity' => $validated['quantity'],
                'reference_type' => 'transfer',
                'reference_id' => $fromVariation->id,
                'description' => $validated['description'],
                'user_id' => Auth::id()
            ]);

            DB::commit();

            return back()->with('success', 'Transferência realizada com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao realizar transferência.');
        }
    }
}
