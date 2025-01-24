<?php

namespace App\Http\Controllers\Customers;

use App\Http\Controllers\Controller;
use App\Models\CustomerCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerCategoryController extends Controller
{
    public function index()
    {
        $categories = CustomerCategory::query()
            ->withCount('customers')
            ->orderBy('order')
            ->get();

        return Inertia::render('Customers/Categories/Index', [
            'categories' => $categories
        ]);
    }

    public function create()
    {
        return Inertia::render('Customers/Categories/Create', [
            'categories' => CustomerCategory::where('parent_id', null)->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:customer_categories,id',
            'order' => 'nullable|integer',
            'active' => 'boolean'
        ]);

        CustomerCategory::create($validated);

        return redirect()
            ->route('customers.categories.index')
            ->with('success', 'Categoria criada com sucesso!');
    }

    public function edit(CustomerCategory $category)
    {
        return Inertia::render('Customers/Categories/Edit', [
            'category' => $category,
            'categories' => CustomerCategory::where('parent_id', null)
                ->where('id', '!=', $category->id)
                ->get()
        ]);
    }

    public function update(Request $request, CustomerCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:customer_categories,id',
            'order' => 'nullable|integer',
            'active' => 'boolean'
        ]);

        $category->update($validated);

        return redirect()
            ->route('customers.categories.index')
            ->with('success', 'Categoria atualizada com sucesso!');
    }

    public function destroy(CustomerCategory $category)
    {
        if ($category->customers()->exists()) {
            return redirect()
                ->route('customers.categories.index')
                ->with('error', 'Não é possível excluir uma categoria que possui clientes!');
        }

        $category->delete();

        return redirect()
            ->route('customers.categories.index')
            ->with('success', 'Categoria excluída com sucesso!');
    }
}
