<?php

namespace App\Http\Controllers\Products;

use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\ProductCategory;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'variations'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                        ->orWhere('barcode', 'like', "%{$search}%");
                });
            })
            ->when($request->category_id, function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->stock_status, function ($query, $stockStatus) {
                switch ($stockStatus) {
                    case 'out_of_stock':
                        $query->where('stock', '<=', 0);
                        break;
                    case 'low_stock':
                        $query->where('stock', '<=', DB::raw('min_stock'))
                            ->where('stock', '>', 0);
                        break;
                    case 'in_stock':
                        $query->where('stock', '>', DB::raw('min_stock'));
                        break;
                }
            });

        $products = $query->orderBy($request->sort_field ?? 'name', $request->sort_direction ?? 'asc')
            ->paginate(10)
            ->withQueryString();

        $categories = ProductCategory::all();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->all(['search', 'category_id', 'status', 'stock_status', 'sort_field', 'sort_direction'])
        ]);
    }

    public function create()
    {
        $categories = ProductCategory::all();

        return Inertia::render('Products/Create', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:product_categories,id',
            'sku' => 'nullable|string|unique:products,sku',
            'barcode' => 'nullable|string|unique:products,barcode',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'min_stock' => 'required|integer|min:0',
            'status' => 'required|in:active,inactive',
            'attributes' => 'nullable|array',
            'images.*' => 'nullable|image|max:2048'
        ]);

        DB::beginTransaction();

        try {
            $product = Product::create($validated);

            // Processa as imagens
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('products', 'public');
                    $product->images()->create([
                        'path' => $path,
                        'is_main' => $product->images()->count() === 0
                    ]);
                }
            }

            // Registra o movimento inicial de estoque
            if ($validated['stock'] > 0) {
                $product->stockMovements()->create([
                    'type' => 'entrada',
                    'quantity' => $validated['stock'],
                    'unit_cost' => $validated['cost_price'],
                    'description' => 'Estoque inicial',
                    'user_id' => Auth::id()
                ]);
            }

            DB::commit();

            return redirect()->route('products.index')
                ->with('success', 'Produto criado com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao criar produto: ' . $e->getMessage());
        }
    }

    public function show(Product $product)
    {
        $product->load([
            'category',
            'variations.stockMovements' => fn($query) => $query->latest()->take(5),
            'stockMovements' => fn($query) => $query->latest()->take(5),
            'images'
        ]);

        return Inertia::render('Products/Show', [
            'product' => $product
        ]);
    }

    public function edit(Product $product)
    {
        $product->load(['category', 'variations', 'images']);
        $categories = ProductCategory::all();

        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:product_categories,id',
            'sku' => 'nullable|string|unique:products,sku,' . $product->id,
            'barcode' => 'nullable|string|unique:products,barcode,' . $product->id,
            'price' => 'required|numeric|min:0',
            'cost_price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'min_stock' => 'required|integer|min:0',
            'status' => 'required|in:active,inactive',
            'attributes' => 'nullable|array',
            'images.*' => 'nullable|image|max:2048'
        ]);

        DB::beginTransaction();

        try {
            // Verifica se houve alteração no estoque
            $stockDiff = $validated['stock'] - $product->stock;

            $product->update($validated);

            // Processa as imagens
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('products', 'public');
                    $product->images()->create([
                        'path' => $path,
                        'is_main' => $product->images()->count() === 0
                    ]);
                }
            }

            // Registra o movimento de estoque se houver diferença
            if ($stockDiff !== 0) {
                $product->stockMovements()->create([
                    'type' => $stockDiff > 0 ? 'entrada' : 'saida',
                    'quantity' => abs($stockDiff),
                    'unit_cost' => $validated['cost_price'],
                    'description' => 'Ajuste manual de estoque',
                    'user_id' => Auth::id()
                ]);
            }

            DB::commit();

            return redirect()->route('products.index')
                ->with('success', 'Produto atualizado com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao atualizar produto: ' . $e->getMessage());
        }
    }

    public function destroy(Product $product)
    {
        if ($product->orders()->exists()) {
            return back()->with('error', 'Não é possível excluir um produto que possui pedidos.');
        }

        DB::beginTransaction();

        try {
            // Remove as imagens do storage
            foreach ($product->images as $image) {
                Storage::disk('public')->delete($image->path);
            }

            // Remove o produto e seus relacionamentos
            $product->delete();

            DB::commit();

            return redirect()->route('products.index')
                ->with('success', 'Produto excluído com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao excluir produto.');
        }
    }
}
