<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductCategoryController extends Controller
{
    public function index()
    {
        $categories = ProductCategory::query()
            ->withCount('products')
            ->when(request('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('order')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Products/Categories/Index', [
            'categories' => $categories
        ]);
    }

    public function create()
    {
        $categories = ProductCategory::where('active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Products/Categories/Form', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|min:3',
            'description' => 'nullable',
            'parent_id' => 'nullable|exists:product_categories,id',
            'order' => 'integer|min:0',
            'active' => 'boolean'
        ]);

        ProductCategory::create($validated);

        return redirect()->route('products.categories.index')
            ->with('success', 'Categoria cadastrada com sucesso!');
    }

    public function edit(ProductCategory $category)
    {
        $categories = ProductCategory::where('active', true)
            ->where('id', '!=', $category->id)
            ->orderBy('name')
            ->get();

        return Inertia::render('Products/Categories/Form', [
            'category' => $category,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, ProductCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|min:3',
            'description' => 'nullable',
            'parent_id' => 'nullable|exists:product_categories,id',
            'order' => 'integer|min:0',
            'active' => 'boolean'
        ]);

        $category->update($validated);

        return redirect()->route('products.categories.index')
            ->with('success', 'Categoria atualizada com sucesso!');
    }

    public function destroy(ProductCategory $category)
    {
        if ($category->products()->exists()) {
            return redirect()->route('products.categories.index')
                ->with('error', 'Não é possível excluir uma categoria que possui produtos!');
        }

        $category->delete();

        return redirect()->route('products.categories.index')
            ->with('success', 'Categoria excluída com sucesso!');
    }
}
