<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::query()
            ->with(['category', 'images' => function($query) {
                $query->where('is_main', true);
            }])
            ->when(request('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('barcode', 'like', "%{$search}%");
            })
            ->when(request('category'), function ($query, $category) {
                $query->where('category_id', $category);
            })
            ->when(request('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy(request('sort', 'name'), request('direction', 'asc'))
            ->paginate(10)
            ->withQueryString();

        $categories = ProductCategory::where('active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => request()->only(['search', 'category', 'status', 'sort', 'direction'])
        ]);
    }

    public function create()
    {
        $categories = ProductCategory::where('active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Products/Form', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|min:3',
            'description' => 'nullable',
            'category_id' => 'required|exists:product_categories,id',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'required|numeric|min:0',
            'stock' => 'required|numeric|min:0',
            'min_stock' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive',
            'barcode' => 'nullable|unique:products',
            'weight' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',
            'width' => 'nullable|numeric|min:0',
            'length' => 'nullable|numeric|min:0',
            'featured' => 'boolean',
            'attributes' => 'nullable|array'
        ]);

        $product = Product::create($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $product->images()->create([
                    'path' => $path,
                    'is_main' => $product->images()->count() === 0
                ]);
            }
        }

        return redirect()->route('products.index')
            ->with('success', 'Produto cadastrado com sucesso!');
    }

    public function edit(Product $product)
    {
        $product->load(['category', 'images', 'variations']);

        $categories = ProductCategory::where('active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Products/Form', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|min:3',
            'description' => 'nullable',
            'category_id' => 'required|exists:product_categories,id',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'required|numeric|min:0',
            'stock' => 'required|numeric|min:0',
            'min_stock' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive',
            'barcode' => 'nullable|unique:products,barcode,' . $product->id,
            'weight' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',
            'width' => 'nullable|numeric|min:0',
            'length' => 'nullable|numeric|min:0',
            'featured' => 'boolean',
            'attributes' => 'nullable|array'
        ]);

        $product->update($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $product->images()->create([
                    'path' => $path,
                    'is_main' => $product->images()->count() === 0
                ]);
            }
        }

        return redirect()->route('products.index')
            ->with('success', 'Produto atualizado com sucesso!');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Produto excluído com sucesso!');
    }

    public function duplicate(Product $product)
    {
        // Criar uma cópia do produto
        $newProduct = $product->replicate();
        $newProduct->name = $product->name . ' (Cópia)';
        $newProduct->sku = null; // Será gerado automaticamente
        $newProduct->barcode = null;
        $newProduct->stock = 0;
        $newProduct->save();

        // Duplicar variações
        foreach ($product->variations as $variation) {
            $newVariation = $variation->replicate();
            $newVariation->product_id = $newProduct->id;
            $newVariation->sku = null; // Será gerado automaticamente
            $newVariation->stock = 0;
            $newVariation->save();
        }

        // Duplicar imagens
        foreach ($product->images as $image) {
            $newPath = 'products/' . uniqid() . '_' . basename($image->path);
            if (Storage::disk('public')->exists($image->path)) {
                Storage::disk('public')->copy($image->path, $newPath);

                $newImage = $image->replicate();
                $newImage->imageable_id = $newProduct->id;
                $newImage->path = $newPath;
                $newImage->save();
            }
        }

        return redirect()->back()->with('success', 'Produto duplicado com sucesso!');
    }
}
