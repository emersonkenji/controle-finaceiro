<?php

namespace App\Http\Controllers\Sales;

use Inertia\Inertia;
use App\Models\Order;
use App\Models\Product;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class PdvController extends Controller
{
    public function index()
    {
        return Inertia::render('Sales/Pdv/Index', [
            'products' => Product::with(['category', 'variations'])
                ->where('status', 'active')
                ->where('stock', '>', 0)
                ->get(),
            'customers' => Customer::where('status', 'active')->get(),
            'payment_methods' => [
                ['id' => 'money', 'name' => 'Dinheiro'],
                ['id' => 'credit_card', 'name' => 'Cartão de Crédito'],
                ['id' => 'debit_card', 'name' => 'Cartão de Débito'],
                ['id' => 'pix', 'name' => 'PIX'],
            ],
            'last_orders' => Order::with(['customer', 'items'])
                ->where('user_id', Auth::id())
                ->latest()
                ->take(5)
                ->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.variation_id' => 'nullable|exists:product_variations,id',
            'payment_method' => 'required|string',
            'subtotal' => 'required|numeric|min:0',
            'discount_type' => 'nullable|in:percentage,fixed',
            'discount_value' => 'nullable|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'notes' => 'nullable|string'
        ]);

        try {
            DB::beginTransaction();

            // Cria o pedido
            $order = Order::create([
                'customer_id' => $validated['customer_id'],
                'user_id' => Auth::id(),
                'number' => 'PDV-' . date('Ymd-His'),
                'status' => 'completed',
                'subtotal' => $validated['subtotal'],
                'discount_type' => $validated['discount_type'] ?? null,
                'discount_value' => $validated['discount_value'] ?? 0,
                'total' => $validated['total'],
                'payment_method' => $validated['payment_method'],
                'payment_status' => 'paid',
                'notes' => $validated['notes'],
                'delivery_address' => null
            ]);

            // Adiciona os itens
            foreach ($validated['items'] as $item) {
                $order->items()->create([
                    'product_id' => $item['product_id'],
                    'product_variation_id' => $item['variation_id'] ?? null,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'total' => $item['quantity'] * $item['price']
                ]);

                // Atualiza o estoque
                $product = Product::find($item['product_id']);
                $product->decrement('stock', $item['quantity']);

                if (isset($item['variation_id'])) {
                    $variation = $product->variations()->find($item['variation_id']);
                    $variation->decrement('stock', $item['quantity']);
                }

                // Registra movimentação de estoque
                $product->stockMovements()->create([
                    'type' => 'saida',
                    'quantity' => $item['quantity'],
                    'product_variation_id' => $item['variation_id'] ?? null,
                    'reference_type' => 'venda',
                    'reference_id' => $order->id,
                    'unit_cost' => $product->cost_price
                ]);
            }

            // Registra o pagamento
            $order->payments()->create([
                'method' => $validated['payment_method'],
                'amount' => $validated['total'],
                'status' => 'approved',
                'payment_date' => now(),
                'user_id' => Auth::id()
            ]);

            // Cria a transação financeira
            $order->transaction()->create([
                'type' => 'receivable',
                'description' => 'Venda PDV #' . $order->number,
                'amount' => $validated['total'],
                'due_date' => now(),
                'payment_date' => now(),
                'status' => 'paid',
                'payment_method' => $validated['payment_method'],
                'category_id' => 1, // ID da categoria de vendas
                'user_id' => Auth::id()
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Venda realizada com sucesso!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Erro ao realizar venda: ' . $e->getMessage());
        }
    }

    public function print(Order $order)
    {
        $order->load(['customer', 'items.product', 'items.variation', 'payments']);

        return Inertia::render('Sales/Pdv/Print', [
            'order' => $order,
            'company' => [
                'name' => setting('company.name'),
                'cnpj' => setting('company.cnpj'),
                'phone' => setting('company.phone'),
                'address' => setting('company.address')
            ]
        ]);
    }
}
