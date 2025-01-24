<?php

namespace App\Http\Controllers\Financial;

use Inertia\Inertia;
use App\Models\CostCenter;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class CostCenterController extends Controller
{
    public function index(Request $request)
    {
        $query = CostCenter::with('parent')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%");
                });
            })
            ->when($request->has('active'), function ($query) use ($request) {
                $query->where('active', $request->active);
            });

        $costCenters = $query->orderBy('code')
            ->paginate(10)
            ->withQueryString();

        $parentCostCenters = CostCenter::active()
            ->parents()
            ->get();

        return Inertia::render('Financial/CostCenters/Index', [
            'costCenters' => $costCenters,
            'parentCostCenters' => $parentCostCenters,
            'filters' => $request->all(['search', 'active'])
        ]);
    }

    public function create()
    {
        $parentCostCenters = CostCenter::active()
            ->parents()
            ->get();

        return Inertia::render('Financial/CostCenters/Form', [
            'parentCostCenters' => $parentCostCenters
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'code' => 'required|string|max:50|unique:cost_centers,code',
            'parent_id' => 'nullable|exists:cost_centers,id',
            'budget' => 'nullable|numeric|min:0',
            'active' => 'required|boolean'
        ]);

        if ($validated['parent_id']) {
            $parent = CostCenter::findOrFail($validated['parent_id']);
            if ($parent->parent_id) {
                return back()->with('error', 'Não é permitido criar subcentros de subcentros de custo.');
            }
        }

        CostCenter::create($validated);

        return redirect()->route('financial.cost-centers.index')
            ->with('success', 'Centro de custo criado com sucesso.');
    }

    public function edit(CostCenter $costCenter)
    {
        $parentCostCenters = CostCenter::active()
            ->parents()
            ->where('id', '!=', $costCenter->id)
            ->get();

        return Inertia::render('Financial/CostCenters/Form', [
            'costCenter' => $costCenter,
            'parentCostCenters' => $parentCostCenters
        ]);
    }

    public function update(Request $request, CostCenter $costCenter)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'code' => 'required|string|max:50|unique:cost_centers,code,' . $costCenter->id,
            'parent_id' => 'nullable|exists:cost_centers,id',
            'budget' => 'nullable|numeric|min:0',
            'active' => 'required|boolean'
        ]);

        if ($validated['parent_id']) {
            if ($validated['parent_id'] === $costCenter->id) {
                return back()->with('error', 'Um centro de custo não pode ser seu próprio pai.');
            }

            $parent = CostCenter::findOrFail($validated['parent_id']);
            if ($parent->parent_id) {
                return back()->with('error', 'Não é permitido criar subcentros de subcentros de custo.');
            }
        }

        $costCenter->update($validated);

        return redirect()->route('financial.cost-centers.index')
            ->with('success', 'Centro de custo atualizado com sucesso.');
    }

    public function destroy(CostCenter $costCenter)
    {
        if ($costCenter->transactions()->exists()) {
            return back()->with('error', 'Não é possível excluir um centro de custo que possui transações.');
        }

        if ($costCenter->children()->exists()) {
            return back()->with('error', 'Não é possível excluir um centro de custo que possui subcentros.');
        }

        $costCenter->delete();

        return redirect()->route('financial.cost-centers.index')
            ->with('success', 'Centro de custo excluído com sucesso.');
    }

    public function report(CostCenter $costCenter)
    {
        $transactions = Transaction::with(['category'])
            ->where('cost_center_id', $costCenter->id)
            ->orderBy('due_date', 'desc')
            ->paginate(10);

        $totalSpent = $costCenter->totalSpent();
        $budgetBalance = $costCenter->budgetBalance();
        $budgetUsage = $costCenter->budgetUsagePercentage();

        return Inertia::render('Financial/CostCenters/Report', [
            'costCenter' => $costCenter,
            'transactions' => $transactions,
            'totalSpent' => $totalSpent,
            'budgetBalance' => $budgetBalance,
            'budgetUsage' => $budgetUsage
        ]);
    }
}
