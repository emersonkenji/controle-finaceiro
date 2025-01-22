<?php

namespace App\Http\Controllers;

use App\Models\Commission;
use App\Models\Employee;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CommissionController extends Controller
{
    public function index(Request $request)
    {
        $query = Commission::with(['employee', 'order'])
            ->when($request->employee_id, function ($query, $employeeId) {
                $query->where('employee_id', $employeeId);
            })
            ->when($request->has('status'), function ($query) use ($request) {
                $query->where('status', $request->status);
            })
            ->when($request->start_date, function ($query, $startDate) {
                $query->where('date', '>=', $startDate);
            })
            ->when($request->end_date, function ($query, $endDate) {
                $query->where('date', '<=', $endDate);
            });

        $commissions = $query->orderBy($request->sort_field ?? 'date', $request->sort_direction ?? 'desc')
            ->paginate(10)
            ->withQueryString();

        $employees = Employee::active()->get();

        return Inertia::render('Employees/Commissions/Index', [
            'commissions' => $commissions,
            'employees' => $employees,
            'filters' => $request->all(['employee_id', 'status', 'start_date', 'end_date', 'sort_field', 'sort_direction'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'order_id' => 'required|exists:orders,id',
            'amount' => 'required|numeric|min:0',
            'rate' => 'required|numeric|min:0|max:100',
            'date' => 'required|date',
            'status' => 'required|boolean',
            'notes' => 'nullable|string'
        ]);

        // Verifica se já existe comissão para esta venda
        if (Commission::where('order_id', $validated['order_id'])->exists()) {
            return back()->with('error', 'Já existe uma comissão registrada para esta venda.');
        }

        DB::beginTransaction();

        try {
            Commission::create($validated);

            DB::commit();

            return back()->with('success', 'Comissão registrada com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao registrar comissão.');
        }
    }

    public function update(Request $request, Commission $commission)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'rate' => 'required|numeric|min:0|max:100',
            'date' => 'required|date',
            'status' => 'required|boolean',
            'notes' => 'nullable|string'
        ]);

        DB::beginTransaction();

        try {
            $commission->update($validated);

            DB::commit();

            return back()->with('success', 'Comissão atualizada com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao atualizar comissão.');
        }
    }

    public function destroy(Commission $commission)
    {
        if ($commission->status) {
            return back()->with('error', 'Não é possível excluir uma comissão já paga.');
        }

        DB::beginTransaction();

        try {
            $commission->delete();

            DB::commit();

            return back()->with('success', 'Comissão excluída com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao excluir comissão.');
        }
    }

    public function calculateForOrder(Order $order)
    {
        if (Commission::where('order_id', $order->id)->exists()) {
            return back()->with('error', 'Já existe uma comissão calculada para esta venda.');
        }

        if (!$order->user_id) {
            return back()->with('error', 'Esta venda não possui um vendedor associado.');
        }

        $employee = Employee::where('user_id', $order->user_id)->first();

        if (!$employee) {
            return back()->with('error', 'Vendedor não encontrado como funcionário.');
        }

        if (!$employee->commission_rate) {
            return back()->with('error', 'Funcionário não possui taxa de comissão configurada.');
        }

        DB::beginTransaction();

        try {
            Commission::create([
                'employee_id' => $employee->id,
                'order_id' => $order->id,
                'amount' => ($order->total * $employee->commission_rate) / 100,
                'rate' => $employee->commission_rate,
                'date' => $order->created_at,
                'status' => false,
                'notes' => 'Comissão calculada automaticamente'
            ]);

            DB::commit();

            return back()->with('success', 'Comissão calculada com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao calcular comissão.');
        }
    }

    public function payMultiple(Request $request)
    {
        $validated = $request->validate([
            'commission_ids' => 'required|array',
            'commission_ids.*' => 'exists:commissions,id',
            'date' => 'required|date'
        ]);

        DB::beginTransaction();

        try {
            Commission::whereIn('id', $validated['commission_ids'])
                ->update([
                    'status' => true,
                    'date' => $validated['date']
                ]);

            DB::commit();

            return back()->with('success', 'Comissões pagas com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao pagar comissões.');
        }
    }
}
