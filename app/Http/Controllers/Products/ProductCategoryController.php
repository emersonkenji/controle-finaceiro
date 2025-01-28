<?php

namespace App\Http\Controllers\Products;

use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\ProductCategory;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class ProductCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = ProductCategory::withCount('products')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            });

        $categories = $query->orderBy($request->sort_field ?? 'name', $request->sort_direction ?? 'asc')
            ->paginate(10)
            ->withQueryString();

        $allCategories = ProductCategory::where('status', 'active')->get();

        return Inertia::render('Products/Categories/Index', [
            'categories' => $categories,
            'allCategories' => $allCategories,
            'filters' => $request->all(['search', 'status', 'sort_field', 'sort_direction'])
        ]);
    }

    public function create()
    {
        $categories = ProductCategory::where('parent_id', null)
            ->with('children')
            ->get();

        return Inertia::render('Products/Categories/Create', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        // Validação
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:product_categories,id',
            'status' => 'required|in:active,inactive',
            'order' => 'nullable|integer|min:0'
        ]);

        DB::beginTransaction();

        try {
            // Verificar e definir o valor para o campo order
            if (empty($validated['order'])) {
                $validated['order'] = ProductCategory::where('parent_id', $validated['parent_id'])
                    ->max('order') + 1;
            }

            // Gerar slug, se não for informado
            if (empty($validated['slug'])) {
                $validated['slug'] = Str::slug($validated['name']);
            }

            // Criar a categoria
            $category = ProductCategory::create($validated);
            // $category = ProductCategory::create([
            //     'name' => $validated['name'],
            //     'description' => $validated['description'],
            //     'parent_id' => $validated['parent_id'],
            //     'status' => $validated['status'],
            //     'order' => $validated['order'],
            //     'slug' => $validated['slug']
            // ]);
            // dd($category); // Verificar se está retornando corretamente

            DB::commit();

            return redirect()->route('products.categories.index')
                ->with('success', 'Categoria criada com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack(); // Em caso de erro, rollback
            return back()->with('error', 'Erro ao criar categoria: ' . $e->getMessage());
        }
    }


    public function edit(ProductCategory $category)
    {
        $categories = ProductCategory::where('parent_id', null)
            ->where('id', '!=', $category->id)
            ->with('children')
            ->get();

        return Inertia::render('Products/Categories/Edit', [
            'category' => $category,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, ProductCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => [
                'nullable',
                'exists:product_categories,id',
                function ($attribute, $value, $fail) use ($category) {
                    if ($value === $category->id) {
                        $fail('Uma categoria não pode ser sua própria pai.');
                    }

                    if ($value && $category->children()->exists()) {
                        $fail('Não é possível mover uma categoria que possui subcategorias.');
                    }
                }
            ],
            'status' => 'required|in:active,inactive',
            'order' => 'nullable|integer|min:0'
        ]);

        DB::beginTransaction();

        try {
            // Se a ordem foi alterada, reordena as categorias
            if (isset($validated['order']) && $validated['order'] !== $category->order) {
                if ($validated['order'] > $category->order) {
                    ProductCategory::where('parent_id', $category->parent_id)
                        ->where('order', '>', $category->order)
                        ->where('order', '<=', $validated['order'])
                        ->decrement('order');
                } else {
                    ProductCategory::where('parent_id', $category->parent_id)
                        ->where('order', '>=', $validated['order'])
                        ->where('order', '<', $category->order)
                        ->increment('order');
                }
            }

            $category->update($validated);

            DB::commit();

            return redirect()->route('products.categories.index')
                ->with('success', 'Categoria atualizada com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao atualizar categoria.');
        }
    }

    public function destroy(ProductCategory $category)
    {
        if ($category->products()->exists()) {
            return back()->with('error', 'Não é possível excluir uma categoria que possui produtos.');
        }

        if ($category->children()->exists()) {
            return back()->with('error', 'Não é possível excluir uma categoria que possui subcategorias.');
        }

        DB::beginTransaction();

        try {
            // Reordena as categorias após a exclusão
            ProductCategory::where('parent_id', $category->parent_id)
                ->where('order', '>', $category->order)
                ->decrement('order');

            $category->delete();

            DB::commit();

            return redirect()->route('products.categories.index')
                ->with('success', 'Categoria excluída com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao excluir categoria.');
        }
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:product_categories,id',
            'categories.*.order' => 'required|integer|min:0',
            'parent_id' => 'nullable|exists:product_categories,id'
        ]);

        DB::beginTransaction();

        try {
            foreach ($validated['categories'] as $item) {
                ProductCategory::where('id', $item['id'])->update([
                    'order' => $item['order'],
                    'parent_id' => $validated['parent_id']
                ]);
            }

            DB::commit();

            return back()->with('success', 'Categorias reordenadas com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao reordenar categorias.');
        }
    }
}
