<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVariation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductVariationController extends Controller
{
    public function index(Product $product)
    {
        $variations = $product->variations()
            ->withCount('stockMovements')
            ->orderBy('name')
            ->get();

        return Inertia::render('Products/Variations/Index', [
            'product' => $product,
            'variations' => $variations
        ]);
    }

    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|min:3',
            'sku' => 'nullable|unique:product_variations',
            'price' => 'nullable|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'stock' => 'required|numeric|min:0',
            'attributes' => 'required|array',
            'barcode' => 'nullable|unique:product_variations'
        ]);

        if (empty($validated['sku'])) {
            $validated['sku'] = $product->sku . '-' . strtoupper(uniqid());
        }

        $variation = $product->variations()->create($validated);

        if ($variation->stock > 0) {
            $variation->stockMovements()->create([
                'type' => 'entrada',
                'quantity' => $variation->stock,
                'description' => 'Estoque inicial'
            ]);
        }

        return redirect()->back()
            ->with('success', 'Variação cadastrada com sucesso!');
    }

    public function update(Request $request, Product $product, ProductVariation $variation)
    {
        $validated = $request->validate([
            'name' => 'required|min:3',
            'sku' => 'nullable|unique:product_variations,sku,' . $variation->id,
            'price' => 'nullable|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'stock' => 'required|numeric|min:0',
            'attributes' => 'required|array',
            'barcode' => 'nullable|unique:product_variations,barcode,' . $variation->id
        ]);

        $oldStock = $variation->stock;
        $variation->update($validated);

        if ($variation->stock !== $oldStock) {
            $difference = $variation->stock - $oldStock;
            $variation->stockMovements()->create([
                'type' => $difference > 0 ? 'entrada' : 'saida',
                'quantity' => abs($difference),
                'description' => 'Ajuste de estoque'
            ]);
        }

        return redirect()->back()
            ->with('success', 'Variação atualizada com sucesso!');
    }

    public function destroy(Product $product, ProductVariation $variation)
    {
        $variation->delete();

        return redirect()->back()
            ->with('success', 'Variação excluída com sucesso!');
    }
}
