<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerHistoryController extends Controller
{
    public function index(Customer $customer)
    {
        $history = $customer->history()
            ->with('user')
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('Customers/History/Index', [
            'customer' => $customer,
            'history' => $history
        ]);
    }

    public function store(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'description' => 'required|string',
            'data' => 'nullable|array'
        ]);

        $customer->history()->create([
            ...$validated,
            'user_id' => auth()->id()
        ]);

        return redirect()
            ->back()
            ->with('success', 'Histórico registrado com sucesso!');
    }

    public function destroy(Customer $customer, CustomerHistory $history)
    {
        if ($history->customer_id !== $customer->id) {
            abort(404);
        }

        $history->delete();

        return redirect()
            ->back()
            ->with('success', 'Histórico excluído com sucesso!');
    }
}
