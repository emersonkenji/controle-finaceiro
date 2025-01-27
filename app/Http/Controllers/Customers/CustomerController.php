<?php

namespace App\Http\Controllers\Customers;

use Inertia\Inertia;
use App\Models\Customer;
use Illuminate\Http\Request;
use App\Models\CustomerCategory;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Customers\CustomerAddressModel ;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $customers = Customer::query()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('document_number', 'like', "%{$search}%")
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
            // ->with('category')
            ->paginate(10)
            ->appends($request->only(['search', 'category_id', 'sort', 'direction']));

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search', 'category_id', 'sort', 'direction']),
        ]);
    }

    public function create()
    {
        // return Inertia::render('Customers/Create', [
        //     'categories' => \App\Models\CustomerCategory::all()
        // ]);
        return Inertia::render('Customers/Create', []);
    }

    public function store(Request $request)
    {
        // Validação dos dados
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:customers,email',
            'phone' => 'required|string',
            'category' => 'nullable|string',
            'document_number' => 'nullable|string|unique:customers,document_number',
            'document_type' => 'required|in:pf,pj',
            'status' => 'required|in:active,inactive',
            'address' => 'required|array',
            'address.street' => 'required|string',
            'address.number' => 'required|string',
            'address.complement' => 'nullable|string',
            'address.neighborhood' => 'required|string',
            'address.city' => 'required|string',
            'address.state' => 'required|string',
            'address.zip_code' => 'required|string',
            'credit_limit' => 'nullable|numeric',
            'notes' => 'nullable|string',
        ]);

        // Remove caracteres especiais do documento
        if (isset($validated['document_number'])) {
            $validated['document_number'] = preg_replace('/[^0-9]/', '', $validated['document_number']);
        }

        // Cria o endereço do cliente
        $address = CustomerAddressModel::create([
            'street' => $validated['address']['street'],
            'number' => $validated['address']['number'],
            'complement' => $validated['address']['complement'] ?? null,
            'neighborhood' => $validated['address']['neighborhood'],
            'city' => $validated['address']['city'],
            'state' => $validated['address']['state'],
            'zip_code' => $validated['address']['zip_code'],
            'country' => 'Brasil', // Definindo o país como padrão
        ]);

        // Cria o cliente e associa o endereço
        $customer = Customer::create([
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'],
            'document_number' => $validated['document_number'] ?? null,
            'document_type' => $validated['document_type'],
            'address_id' => $address->id, // Associa o endereço criado
            'status' => $validated['status'],
            'credit_limit' => $validated['credit_limit'] ?? 0,
            'notes' => $validated['notes'] ?? null,
        ]);

        return redirect()
            ->route('customers.index')
            ->with('success', 'Cliente cadastrado com sucesso!');
            dd('Redirecionamento executado');
    }

    // public function store(Request $request)
    // {
    //     dd($request->all());
    //     $validated = $request->validate([
    //         'name' => 'required|string|max:255',
    //         'email' => 'nullable|email|unique:customers',
    //         'phone' => 'required|string',
    //         'document_number' => 'nullable|string|unique:customers',
    //         'document_type' => 'required|in:pf,pj',
    //         'address' => 'required|array',
    //         'address.street' => 'required|string',
    //         'address.number' => 'required|string',
    //         'address.complement' => 'nullable|string',
    //         'address.neighborhood' => 'required|string',
    //         'address.city' => 'required|string',
    //         'address.state' => 'required|string',
    //         'address.cep' => 'required|string',
    //         'status' => 'required|in:active,inactive,blocked',
    //         'category' => 'nullable|string',
    //     ]);

    //     // Remove caracteres especiais do documento
    //     if (isset($validated['document'])) {
    //         $validated['document'] = preg_replace('/[^0-9]/', '', $validated['document']);
    //     }

    //     $customer = Customer::create($validated);

    //     return redirect()
    //         ->route('customers.index')
    //         ->with('success', 'Cliente cadastrado com sucesso!');
    // }

    public function edit(Customer $customer)
    {
        // dd( $customer->load('address'));
        return Inertia::render('Customers/Create', [
            'customer' => $customer->load('address'), // Carrega o relacionamento se houver
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
