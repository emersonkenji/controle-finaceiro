<?php

namespace App\Http\Controllers\Customers;

use Inertia\Inertia;
use App\Models\Customer;
use Illuminate\Http\Request;
use App\Models\CustomerCategory;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Customers\CustomerAddressModel;

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
        $validated = $request->validate(
            [
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
            ],
            [
                'name.required' => 'O campo nome é obrigatório',
                'name.string' => 'O campo nome deve ser uma string',
                'name.max' => 'O campo nome deve ter no máximo 255 caracteres',
                'email.email' => 'O campo email deve ser um email válido',
                'email.unique' => 'Este email já está em uso',
                'phone.required' => 'O campo telefone é obrigatório',
                'phone.string' => 'O campo telefone deve ser uma string',
                'document_number.string' => 'O campo documento deve ser uma string',
                'document_number.unique' => 'Este documento já está em uso',
                'document_type.required' => 'O campo tipo de documento é obrigatório',
                'document_type.in' => 'O campo tipo de documento deve ser pf ou pj',
                'status.required' => 'O campo status é obrigatório',
                'status.in' => 'O campo status deve ser ativo ou inativo',
                'address.required' => 'O campo endereço é obrigatório',
                'address.street.required' => 'O campo rua é obrigatório',
                'address.street.string' => 'O campo rua deve ser uma string',
                'address.number.required' => 'O campo número é obrigatório',
                'address.number.string' => 'O campo número deve ser uma string',
                'address.complement.string' => 'O campo complemento deve ser uma string',
                'address.neighborhood.required' => 'O campo bairro é obrigatório',
                'address.neighborhood.string' => 'O campo bairro deve ser uma string',
                'address.city.required' => 'O campo cidade é obrigatório',
                'address.city.string' => 'O campo cidade deve ser uma string',
                'address.state.required' => 'O campo estado é obrigatório',
                'address.state.string' => 'O campo estado deve ser uma string',
                'address.zip_code.required' => 'O campo CEP é obrigatório',
                'address.zip_code.string' => 'O campo CEP deve ser uma string',
                'credit_limit.numeric' => 'O campo limite de crédito deve ser um número',
                'notes.string' => 'O campo observações deve ser uma string',
            ]
        );

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
    //         'category' => 'nullable|string',
    //         'document_number' => 'nullable|string|unique:customers,document_number'. $customer->id,
    //         'document_type' => 'required|in:pf,pj',
    //         'status' => 'required|in:active,inactive',
    //         'address' => 'required|array',
    //         'address.street' => 'required|string',
    //         'address.number' => 'required|string',
    //         'address.complement' => 'nullable|string',
    //         'address.neighborhood' => 'required|string',
    //         'address.city' => 'required|string',
    //         'address.state' => 'required|string',
    //         'address.zip_code' => 'required|string',
    //         'credit_limit' => 'nullable|numeric',
    //         'notes' => 'nullable|string',
    //     ],
    //     [
    //         'name.required' => 'O campo nome é obrigatório',
    //         'name.string' => 'O campo nome deve ser uma string',
    //         'name.max' => 'O campo nome deve ter no máximo 255 caracteres',
    //         'email.email' => 'O campo email deve ser um email válido',
    //         'email.unique' => 'Este email já está em uso',
    //         'phone.required' => 'O campo telefone é obrigatório',
    //         'phone.string' => 'O campo telefone deve ser uma string',
    //         'document_number.string' => 'O campo documento deve ser uma string',
    //         'document_number.unique' => 'Este documento já está em uso',
    //         'document_type.required' => 'O campo tipo de documento é obrigatório',
    //         'document_type.in' => 'O campo tipo de documento deve ser pf ou pj',
    //         'status.required' => 'O campo status é obrigatório',
    //         'status.in' => 'O campo status deve ser ativo ou inativo',
    //         'address.required' => 'O campo endereço é obrigatório',
    //         'address.street.required' => 'O campo rua é obrigatório',
    //         'address.street.string' => 'O campo rua deve ser uma string',
    //         'address.number.required' => 'O campo número é obrigatório',
    //         'address.number.string' => 'O campo número deve ser uma string',
    //         'address.complement.string' => 'O campo complemento deve ser uma string',
    //         'address.neighborhood.required' => 'O campo bairro é obrigatório',
    //         'address.neighborhood.string' => 'O campo bairro deve ser uma string',
    //         'address.city.required' => 'O campo cidade é obrigatório',
    //         'address.city.string' => 'O campo cidade deve ser uma string',
    //         'address.state.required' => 'O campo estado é obrigatório',
    //         'address.state.string' => 'O campo estado deve ser uma string',
    //         'address.zip_code.required' => 'O campo CEP é obrigatório',
    //         'address.zip_code.string' => 'O campo CEP deve ser uma string',
    //         'credit_limit.numeric' => 'O campo limite de crédito deve ser um número',
    //         'notes.string' => 'O campo observações deve ser uma string',
    //     ]);

    //     $customer->update($validated);

    //     return redirect()
    //         ->route('customers.index')
    //         ->with('success', 'Cliente atualizado com sucesso!');
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
        // dd($request->all());
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:customers,email,' . $customer->id,
            'phone' => 'required|string',
            'category' => 'nullable|string',
            'document_number' => 'nullable|string|unique:customers,document_number,' . $customer->id,
            'document_type' => 'required|in:pf,pj',
            'status' => 'required|in:active,inactive',
            'address.street' => 'required|string',
            'address.number' => 'required|string',
            'address.complement' => 'nullable|string',
            'address.neighborhood' => 'required|string',
            'address.city' => 'required|string',
            'address.state' => 'required|string',
            'address.zip_code' => 'required|string',
            'credit_limit' => 'nullable|numeric',
            'notes' => 'nullable|string',
        ], [
            'name.required' => 'O campo nome é obrigatório.',
            'name.string' => 'O nome deve ser uma string.',
            'name.max' => 'O nome não pode ter mais que 255 caracteres.',
            'email.email' => 'O e-mail deve ser válido.',
            'email.unique' => 'Este e-mail já está em uso.',
            'phone.required' => 'O campo telefone é obrigatório.',
            'phone.string' => 'O telefone deve ser uma string.',
            'category.string' => 'A categoria deve ser uma string.',
            'document_number.string' => 'O número do documento deve ser uma string.',
            'document_number.unique' => 'Este número de documento já está em uso.',
            'document_type.required' => 'O campo tipo de documento é obrigatório.',
            'document_type.in' => 'O tipo de documento selecionado é inválido. Apenas "pf" ou "pj" são aceitos.',
            'status.required' => 'O campo status é obrigatório.',
            'status.in' => 'O status selecionado é inválido. Apenas "active" ou "inactive" são aceitos.',
            'address.required' => 'O campo endereço é obrigatório.',
            'address.array' => 'O endereço deve ser um array.',
            'address.street.required' => 'O campo rua é obrigatório.',
            'address.street.string' => 'O campo rua deve ser uma string.',
            'address.number.required' => 'O campo número é obrigatório.',
            'address.number.string' => 'O campo número deve ser uma string.',
            'address.complement.string' => 'O campo complemento deve ser uma string.',
            'address.neighborhood.required' => 'O campo bairro é obrigatório.',
            'address.neighborhood.string' => 'O campo bairro deve ser uma string.',
            'address.city.required' => 'O campo cidade é obrigatório.',
            'address.city.string' => 'O campo cidade deve ser uma string.',
            'address.state.required' => 'O campo estado é obrigatório.',
            'address.state.string' => 'O campo estado deve ser uma string.',
            'address.zip_code.required' => 'O campo CEP é obrigatório.',
            'address.zip_code.string' => 'O campo CEP deve ser uma string.',
            'credit_limit.numeric' => 'O campo limite de crédito deve ser um número.',
            'notes.string' => 'O campo observações deve ser uma string.'
        ]);

        // Atualiza o endereço do cliente
        $addressData = $validated['address'];
        $customer->address()->update($addressData);

        // Atualiza os dados do cliente
        $customer->update([
            'name' => $validated['name'],
            'email' => $validated['email'] ?? $customer->email,
            'phone' => $validated['phone'],
            'document_number' => $validated['document_number'],
            'document_type' => $validated['document_type'],
            'status' => $validated['status'],
            'credit_limit' => $validated['credit_limit'] ?? 0,
            'notes' => $validated['notes'] ?? null,
        ]);

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
