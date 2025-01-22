<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\EmployeeHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EmployeeHistoryController extends Controller
{
    public function index(Employee $employee)
    {
        $history = EmployeeHistory::with(['user', 'attachments'])
            ->where('employee_id', $employee->id)
            ->orderBy('date', 'desc')
            ->paginate(10);

        return Inertia::render('Employees/History/Index', [
            'employee' => $employee,
            'history' => $history
        ]);
    }

    public function store(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'description' => 'required|string',
            'date' => 'required|date',
            'data' => 'nullable|array',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|max:10240'
        ]);

        DB::beginTransaction();

        try {
            $history = EmployeeHistory::create([
                'employee_id' => $employee->id,
                'type' => $validated['type'],
                'description' => $validated['description'],
                'date' => $validated['date'],
                'data' => $validated['data'] ?? null,
                'user_id' => Auth::id()
            ]);

            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('employee-history');

                    $history->attachments()->create([
                        'name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'mime_type' => $file->getMimeType(),
                        'size' => $file->getSize(),
                        'user_id' => Auth::id()
                    ]);
                }
            }

            DB::commit();

            return back()->with('success', 'Registro adicionado ao histórico com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao adicionar registro ao histórico.');
        }
    }

    public function destroy(Employee $employee, EmployeeHistory $history)
    {
        if ($history->employee_id !== $employee->id) {
            return back()->with('error', 'Registro não pertence a este funcionário.');
        }

        DB::beginTransaction();

        try {
            // Remove os arquivos do storage
            foreach ($history->attachments as $attachment) {
                if (Storage::exists($attachment->path)) {
                    Storage::delete($attachment->path);
                }
                $attachment->delete();
            }

            $history->delete();

            DB::commit();

            return back()->with('success', 'Registro removido do histórico com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao remover registro do histórico.');
        }
    }
}
