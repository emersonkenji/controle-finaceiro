<?php

namespace App\Http\Controllers;

use App\Models\CustomerCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerCategoryController extends Controller
{
    public function index()
    {
        $categories = [
            ['id' => 'regular', 'name' => 'Regular', 'description' => 'Cliente padrão'],
            ['id' => 'vip', 'name' => 'VIP', 'description' => 'Cliente VIP com benefícios especiais'],
            ['id' => 'premium', 'name' => 'Premium', 'description' => 'Cliente Premium com benefícios exclusivos']
        ];

        return Inertia::render('Customers/Categories/Index', [
            'categories' => $categories
        ]);
    }
}
