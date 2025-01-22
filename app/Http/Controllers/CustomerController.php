<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::query()
            ->when(request('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('cpf', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Customers/Index', [
            'customers' => $customers
        ]);
    }

    public function create()
    {
        return Inertia::render('Customers/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|min:3',
            'email' => 'required|email|unique:customers',
            'cpf' => 'required|unique:customers',
            'phone' => 'required',
            'category' => 'required',
            'status' => 'required',
            'address' => 'required|array',
            'address.cep' => 'required',
            'address.street' => 'required',
            'address.number' => 'required',
            'address.neighborhood' => 'required',
            'address.city' => 'required',
            'address.state' => 'required|size:2',
        ]);

        $customer = Customer::create($validated);

        return redirect()->route('customers.index')
            ->with('success', 'Cliente cadastrado com sucesso!');
    }

    public function edit(Customer $customer)
    {
        return Inertia::render('Customers/Form', [
            'customer' => $customer
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name' => 'required|min:3',
            'email' => 'required|email|unique:customers,email,' . $customer->id,
            'cpf' => 'required|unique:customers,cpf,' . $customer->id,
            'phone' => 'required',
            'category' => 'required',
            'status' => 'required',
            'address' => 'required|array',
            'address.cep' => 'required',
            'address.street' => 'required',
            'address.number' => 'required',
            'address.neighborhood' => 'required',
            'address.city' => 'required',
            'address.state' => 'required|size:2',
        ]);

        $customer->update($validated);

        return redirect()->route('customers.index')
            ->with('success', 'Cliente atualizado com sucesso!');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return redirect()->route('customers.index')
            ->with('success', 'Cliente excluído com sucesso!');
    }
}
