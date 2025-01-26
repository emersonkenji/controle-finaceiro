<?php

namespace App\Http\Controllers\Customers;

use Inertia\Inertia;
use App\Models\Customer;
use Illuminate\Http\Request;
use App\Models\CustomerCategory;
use App\Http\Controllers\Controller;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $customers = Customer::query()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('document', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when($request->category_id, function ($query, $categoryId) {
                $query->where('customer_category_id', $categoryId);
            })
            ->when($request->sort, function ($query, $sort) {
                $direction = $request->direction ?? 'asc';
                $query->orderBy($sort, $direction);
            })
            ->with('category')
            ->paginate(10)
            ->appends($request->only(['search', 'category_id', 'sort', 'direction']));

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search', 'category_id', 'sort', 'direction']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Customers/Create', [
            'categories' => \App\Models\CustomerCategory::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:customers',
            'document' => 'nullable|string|unique:customers',
            'phone' => 'required|string',
            'category' => 'nullable|string',
            'address' => 'required|array',
            'address.street' => 'required|string',
            'address.number' => 'required|string',
            'address.complement' => 'nullable|string',
            'address.neighborhood' => 'required|string',
            'address.city' => 'required|string',
            'address.state' => 'required|string',
            'address.cep' => 'required|string',
            'status' => 'required|in:active,inactive,blocked',
        ]);

        // Remove caracteres especiais do documento
        if (isset($validated['document'])) {
            $validated['document'] = preg_replace('/[^0-9]/', '', $validated['document']);
        }

        $customer = Customer::create($validated);

        return redirect()
            ->route('customers.index')
            ->with('success', 'Cliente cadastrado com sucesso!');
    }

    public function edit(Customer $customer)
    {
        return Inertia::render('Customers/Edit', [
            'customer' => $customer,
            'categories' => \App\Models\CustomerCategory::all()
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email,' . $customer->id,
            'document' => 'required|string|unique:customers,document,' . $customer->id,
            'phone' => 'required|string',
            'customer_category_id' => 'nullable|exists:customer_categories,id',
            'address' => 'required|array',
            'address.street' => 'required|string',
            'address.number' => 'required|string',
            'address.complement' => 'nullable|string',
            'address.neighborhood' => 'required|string',
            'address.city' => 'required|string',
            'address.state' => 'required|string',
            'address.cep' => 'required|string',
            'notes' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'type' => 'required|in:pf,pj'
        ]);

        $customer->update($validated);

        return redirect()
            ->route('customers.index')
            ->with('success', 'Cliente atualizado com sucesso!');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return redirect()
            ->route('customers.index')
            ->with('success', 'Cliente excluído com sucesso!');
    }
}
