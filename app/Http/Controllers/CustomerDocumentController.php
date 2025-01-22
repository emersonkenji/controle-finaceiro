<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerDocument;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerDocumentController extends Controller
{
    public function index(Customer $customer)
    {
        $documents = [
            [
                'id' => 1,
                'type' => 'rg',
                'name' => 'RG.pdf',
                'uploaded_at' => '2024-01-15'
            ],
            [
                'id' => 2,
                'type' => 'cpf',
                'name' => 'CPF.pdf',
                'uploaded_at' => '2024-01-15'
            ],
            [
                'id' => 3,
                'type' => 'comprovante_residencia',
                'name' => 'Comprovante_Residencia.pdf',
                'uploaded_at' => '2024-01-15'
            ]
        ];

        return Inertia::render('Customers/Documents/Index', [
            'customer' => $customer,
            'documents' => $documents
        ]);
    }
}
