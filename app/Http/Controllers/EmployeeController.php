<?php
namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::with(['user'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('document', 'like', "%{$search}%");
                });
            })
            ->when($request->department, function ($query, $department) {
                $query->where('department', $department);
            })
            ->when($request->position, function ($query, $position) {
                $query->where('position', $position);
            })
            ->when($request->has('status'), function ($query) use ($request) {
                $query->where('status', $request->status);
            });

        $employees = $query->orderBy($request->sort_field ?? 'name', $request->sort_direction ?? 'asc')
            ->paginate(10)
            ->withQueryString();

        $departments = Employee::distinct()->pluck('department');
        $positions = Employee::distinct()->pluck('position');

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'departments' => $departments,
            'positions' => $positions,
            'filters' => $request->all(['search', 'department', 'position', 'status', 'sort_field', 'sort_direction'])
        ]);
    }

    public function create()
    {
        $departments = Employee::distinct()->pluck('department');
        $positions = Employee::distinct()->pluck('position');

        return Inertia::render('Employees/Form', [
            'departments' => $departments,
            'positions' => $positions
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email',
            'phone' => 'nullable|string|max:20',
            'document' => 'required|string|max:20|unique:employees,document',
            'birth_date' => 'nullable|date',
            'hire_date' => 'required|date',
            'termination_date' => 'nullable|date|after:hire_date',
            'position' => 'required|string|max:100',
            'department' => 'required|string|max:100',
            'salary' => 'required|numeric|min:0',
            'commission_rate' => 'nullable|numeric|min:0|max:100',
            'status' => 'required|boolean',
            'notes' => 'nullable|string',
            'documents' => 'nullable|array',
            'documents.*' => 'file|max:10240'
        ]);

        DB::beginTransaction();

        try {
            $employee = Employee::create($validated);

            if ($request->hasFile('documents')) {
                foreach ($request->file('documents') as $file) {
                    $path = $file->store('documents/employees/' . $employee->id);

                    $employee->documents()->create([
                        'name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'mime_type' => $file->getMimeType(),
                        'size' => $file->getSize(),
                        'user_id' => Auth::id()
                    ]);
                }
            }

            // Registra no histórico
            $employee->history()->create([
                'type' => 'created',
                'description' => 'Funcionário cadastrado no sistema',
                'date' => now(),
                'user_id' => Auth::id()
            ]);

            DB::commit();

            return redirect()->route('employees.index')
                ->with('success', 'Funcionário cadastrado com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao cadastrar funcionário.');
        }
    }

    public function edit(Employee $employee)
    {
        $employee->load(['documents', 'history' => function ($query) {
            $query->latest()->take(5);
        }]);

        $departments = Employee::distinct()->pluck('department');
        $positions = Employee::distinct()->pluck('position');

        return Inertia::render('Employees/Form', [
            'employee' => $employee,
            'departments' => $departments,
            'positions' => $positions
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email,' . $employee->id,
            'phone' => 'nullable|string|max:20',
            'document' => 'required|string|max:20|unique:employees,document,' . $employee->id,
            'birth_date' => 'nullable|date',
            'hire_date' => 'required|date',
            'termination_date' => 'nullable|date|after:hire_date',
            'position' => 'required|string|max:100',
            'department' => 'required|string|max:100',
            'salary' => 'required|numeric|min:0',
            'commission_rate' => 'nullable|numeric|min:0|max:100',
            'status' => 'required|boolean',
            'notes' => 'nullable|string',
            'documents' => 'nullable|array',
            'documents.*' => 'file|max:10240'
        ]);

        DB::beginTransaction();

        try {
            $changes = array_diff_assoc($validated, $employee->getAttributes());
            $employee->update($validated);

            if ($request->hasFile('documents')) {
                foreach ($request->file('documents') as $file) {
                    $path = $file->store('documents/employees/' . $employee->id);

                    $employee->documents()->create([
                        'name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'mime_type' => $file->getMimeType(),
                        'size' => $file->getSize(),
                        'user_id' => Auth::id()
                    ]);
                }
            }

            // Registra no histórico se houve mudanças
            if (!empty($changes)) {
                $employee->history()->create([
                    'type' => 'updated',
                    'description' => 'Informações do funcionário atualizadas',
                    'date' => now(),
                    'data' => $changes,
                    'user_id' => Auth::id()
                ]);
            }

            DB::commit();

            return redirect()->route('employees.index')
                ->with('success', 'Funcionário atualizado com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao atualizar funcionário.');
        }
    }

    public function destroy(Employee $employee)
    {
        if ($employee->sales()->exists()) {
            return back()->with('error', 'Não é possível excluir um funcionário que possui vendas registradas.');
        }

        DB::beginTransaction();

        try {
            // Remove os documentos do storage
            foreach ($employee->documents as $document) {
                if (Storage::exists($document->path)) {
                    Storage::delete($document->path);
                }
                $document->delete();
            }

            $employee->delete();

            DB::commit();

            return redirect()->route('employees.index')
                ->with('success', 'Funcionário excluído com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao excluir funcionário.');
        }
    }

    public function performance(Employee $employee, Request $request)
    {
        $startDate = $request->start_date ? Carbon::parse($request->start_date) : Carbon::now()->startOfMonth();
        $endDate = $request->end_date ? Carbon::parse($request->end_date) : Carbon::now()->endOfMonth();

        $sales = $employee->sales()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        $commissions = $employee->commissions()
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        $totalSales = $sales->sum('total');
        $totalCommissions = $commissions->sum('amount');
        $averageTicket = $sales->count() > 0 ? $totalSales / $sales->count() : 0;

        // Dados para o gráfico de vendas por dia
        $salesByDay = $sales->groupBy(function ($sale) {
            return $sale->created_at->format('Y-m-d');
        })->map(function ($sales) {
            return $sales->sum('total');
        });

        return Inertia::render('Employees/Performance', [
            'employee' => $employee,
            'startDate' => $startDate->format('Y-m-d'),
            'endDate' => $endDate->format('Y-m-d'),
            'totalSales' => $totalSales,
            'totalCommissions' => $totalCommissions,
            'averageTicket' => $averageTicket,
            'salesCount' => $sales->count(),
            'salesByDay' => $salesByDay,
            'recentSales' => $sales->take(5),
            'recentCommissions' => $commissions->take(5)
        ]);
    }
}
