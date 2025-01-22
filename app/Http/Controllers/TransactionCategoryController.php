<?php

namespace App\Http\Controllers;

use App\Models\TransactionCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = TransactionCategory::with('parent')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($request->type, function ($query, $type) {
                $query->where('type', $type);
            })
            ->when($request->has('active'), function ($query) use ($request) {
                $query->where('active', $request->active);
            });

        $categories = $query->orderBy('order')
            ->paginate(10)
            ->withQueryString();

        $parentCategories = TransactionCategory::active()
            ->parents()
            ->get();

        return Inertia::render('Financial/Categories/Index', [
            'categories' => $categories,
            'parentCategories' => $parentCategories,
            'filters' => $request->all(['search', 'type', 'active'])
        ]);
    }

    public function create()
    {
        $parentCategories = TransactionCategory::active()
            ->parents()
            ->get();

        return Inertia::render('Financial/Categories/Form', [
            'parentCategories' => $parentCategories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:both,receivable,payable',
            'parent_id' => 'nullable|exists:transaction_categories,id',
            'order' => 'nullable|integer|min:0',
            'active' => 'required|boolean'
        ]);

        if ($validated['parent_id']) {
            $parent = TransactionCategory::findOrFail($validated['parent_id']);
            if ($parent->parent_id) {
                return back()->with('error', 'Não é permitido criar subcategorias de subcategorias.');
            }
        }

        TransactionCategory::create($validated);

        return redirect()->route('financial.categories.index')
            ->with('success', 'Categoria criada com sucesso.');
    }

    public function edit(TransactionCategory $category)
    {
        $parentCategories = TransactionCategory::active()
            ->parents()
            ->where('id', '!=', $category->id)
            ->get();

        return Inertia::render('Financial/Categories/Form', [
            'category' => $category,
            'parentCategories' => $parentCategories
        ]);
    }

    public function update(Request $request, TransactionCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:both,receivable,payable',
            'parent_id' => 'nullable|exists:transaction_categories,id',
            'order' => 'nullable|integer|min:0',
            'active' => 'required|boolean'
        ]);

        if ($validated['parent_id']) {
            if ($validated['parent_id'] === $category->id) {
                return back()->with('error', 'Uma categoria não pode ser sua própria pai.');
            }

            $parent = TransactionCategory::findOrFail($validated['parent_id']);
            if ($parent->parent_id) {
                return back()->with('error', 'Não é permitido criar subcategorias de subcategorias.');
            }
        }

        $category->update($validated);

        return redirect()->route('financial.categories.index')
            ->with('success', 'Categoria atualizada com sucesso.');
    }

    public function destroy(TransactionCategory $category)
    {
        if ($category->transactions()->exists()) {
            return back()->with('error', 'Não é possível excluir uma categoria que possui transações.');
        }

        if ($category->children()->exists()) {
            return back()->with('error', 'Não é possível excluir uma categoria que possui subcategorias.');
        }

        $category->delete();

        return redirect()->route('financial.categories.index')
            ->with('success', 'Categoria excluída com sucesso.');
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:transaction_categories,id',
            'categories.*.order' => 'required|integer|min:0'
        ]);

        DB::beginTransaction();

        try {
            foreach ($validated['categories'] as $categoryData) {
                TransactionCategory::where('id', $categoryData['id'])
                    ->update(['order' => $categoryData['order']]);
            }

            DB::commit();

            return back()->with('success', 'Ordem das categorias atualizada com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao atualizar a ordem das categorias.');
        }
    }
}
