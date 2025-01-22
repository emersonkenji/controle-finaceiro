<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVariation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductStockController extends Controller
{
    public function index(Product $product)
    {
        $product->load(['variations', 'stockMovements' => function($query) {
            $query->latest()->take(10);
        }]);

        return Inertia::render('Products/Stock/Index', [
            'product' => $product
        ]);
    }

    public function adjust(Request $request, Product $product)
    {
        $validated = $request->validate([
            'type' => 'required|in:entrada,saida,ajuste',
            'quantity' => 'required|integer|min:1',
            'description' => 'required|string',
            'unit_cost' => 'nullable|numeric|min:0',
            'variation_id' => 'nullable|exists:product_variations,id'
        ]);

        if ($validated['variation_id']) {
            $variation = ProductVariation::findOrFail($validated['variation_id']);

            if ($validated['type'] === 'saida' && $variation->stock < $validated['quantity']) {
                return redirect()->back()
                    ->with('error', 'Estoque insuficiente para esta variação!');
            }

            $variation->stockMovements()->create([
                'type' => $validated['type'],
                'quantity' => $validated['quantity'],
                'description' => $validated['description'],
                'unit_cost' => $validated['unit_cost']
            ]);

            $newStock = $validated['type'] === 'entrada'
                ? $variation->stock + $validated['quantity']
                : $variation->stock - $validated['quantity'];

            $variation->update(['stock' => $newStock]);
        } else {
            if ($validated['type'] === 'saida' && $product->stock < $validated['quantity']) {
                return redirect()->back()
                    ->with('error', 'Estoque insuficiente!');
            }

            $product->stockMovements()->create([
                'type' => $validated['type'],
                'quantity' => $validated['quantity'],
                'description' => $validated['description'],
                'unit_cost' => $validated['unit_cost']
            ]);

            $newStock = $validated['type'] === 'entrada'
                ? $product->stock + $validated['quantity']
                : $product->stock - $validated['quantity'];

            $product->update(['stock' => $newStock]);
        }

        return redirect()->back()
            ->with('success', 'Estoque ajustado com sucesso!');
    }

    public function history(Product $product)
    {
        $movements = $product->stockMovements()
            ->with('variation')
            ->latest()
            ->paginate(20);

        return Inertia::render('Products/Stock/History', [
            'product' => $product,
            'movements' => $movements
        ]);
    }
}
