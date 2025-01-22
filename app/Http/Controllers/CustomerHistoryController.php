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
        $history = [
            [
                'id' => 1,
                'type' => 'purchase',
                'description' => 'Compra realizada',
                'value' => 1250.00,
                'date' => '2024-01-15'
            ],
            [
                'id' => 2,
                'type' => 'score',
                'description' => 'Pontos adicionados',
                'value' => 125,
                'date' => '2024-01-15'
            ],
            [
                'id' => 3,
                'type' => 'category',
                'description' => 'Categoria alterada para VIP',
                'value' => null,
                'date' => '2024-01-10'
            ]
        ];

        return Inertia::render('Customers/History/Index', [
            'customer' => $customer,
            'history' => $history
        ]);
    }
}
