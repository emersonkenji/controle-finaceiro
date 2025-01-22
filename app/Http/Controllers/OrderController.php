<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Customer;
use App\Models\Product;
use App\Models\ProductVariation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['customer', 'user'])
            ->when($request->search, function ($query, $search) {
                $query->where('number', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($query) use ($search) {
                        $query->where('name', 'like', "%{$search}%");
                    });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->payment_status, function ($query, $status) {
                $query->where('payment_status', $status);
            })
            ->when($request->start_date, function ($query, $date) {
                $query->whereDate('created_at', '>=', $date);
            })
            ->when($request->end_date, function ($query, $date) {
                $query->whereDate('created_at', '<=', $date);
            });

        $orders = $query->orderBy($request->sort_field ?? 'created_at', $request->sort_direction ?? 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'filters' => $request->all(['search', 'status', 'payment_status', 'start_date', 'end_date', 'sort_field', 'sort_direction'])
        ]);
    }

    public function create()
    {
        $customers = Customer::where('status', 'active')->get();
        $products = Product::with(['category', 'variations', 'images'])
            ->where('status', 'active')
            ->where('stock', '>', 0)
            ->get();

        return Inertia::render('Orders/Create', [
            'customers' => $customers,
            'products' => $products
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.product_variation_id' => 'nullable|exists:product_variations,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.discount_type' => 'nullable|in:percentage,fixed',
            'items.*.discount_value' => 'nullable|numeric|min:0',
            'payment_method' => 'required|string',
            'discount_type' => 'nullable|in:percentage,fixed',
            'discount_value' => 'nullable|numeric|min:0',
            'shipping_cost' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'delivery_address' => 'nullable|array'
        ]);

        DB::beginTransaction();

        try {
            // Calcula o subtotal e total
            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                $itemTotal = $item['quantity'] * $item['unit_price'];
                if (!empty($item['discount_type'])) {
                    $itemTotal -= $item['discount_type'] === 'percentage'
                        ? ($itemTotal * $item['discount_value'] / 100)
                        : $item['discount_value'];
                }
                $subtotal += $itemTotal;
            }

            // Aplica desconto geral se houver
            $total = $subtotal;
            if (!empty($validated['discount_type'])) {
                $total -= $validated['discount_type'] === 'percentage'
                    ? ($total * $validated['discount_value'] / 100)
                    : $validated['discount_value'];
            }

            // Adiciona frete se houver
            if (!empty($validated['shipping_cost'])) {
                $total += $validated['shipping_cost'];
            }

            // Cria o pedido
            $order = Order::create([
                'customer_id' => $validated['customer_id'],
                'user_id' => Auth::id(),
                'subtotal' => $subtotal,
                'discount_type' => $validated['discount_type'] ?? null,
                'discount_value' => $validated['discount_value'] ?? 0,
                'shipping_cost' => $validated['shipping_cost'] ?? 0,
                'total' => $total,
                'payment_method' => $validated['payment_method'],
                'notes' => $validated['notes'] ?? null,
                'delivery_address' => $validated['delivery_address'],
                'status' => 'pending',
                'payment_status' => 'pending'
            ]);

            // Cria os itens do pedido
            foreach ($validated['items'] as $item) {
                $itemTotal = $item['quantity'] * $item['unit_price'];
                if (!empty($item['discount_type'])) {
                    $itemTotal -= $item['discount_type'] === 'percentage'
                        ? ($itemTotal * $item['discount_value'] / 100)
                        : $item['discount_value'];
                }

                $order->items()->create([
                    'product_id' => $item['product_id'],
                    'product_variation_id' => $item['product_variation_id'] ?? null,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'discount_type' => $item['discount_type'] ?? null,
                    'discount_value' => $item['discount_value'] ?? 0,
                    'total' => $itemTotal
                ]);

                // Atualiza o estoque
                if (!empty($item['product_variation_id'])) {
                    $variation = ProductVariation::find($item['product_variation_id']);
                    if ($variation->stock < $item['quantity']) {
                        throw new \Exception("Estoque insuficiente para o produto {$variation->product->name} - {$variation->name}");
                    }
                    $variation->decrement('stock', $item['quantity']);
                    $variation->stockMovements()->create([
                        'type' => 'saida',
                        'quantity' => $item['quantity'],
                        'reference_type' => 'order',
                        'reference_id' => $order->id,
                        'description' => "Venda #{$order->number}"
                    ]);
                } else {
                    $product = Product::find($item['product_id']);
                    if ($product->stock < $item['quantity']) {
                        throw new \Exception("Estoque insuficiente para o produto {$product->name}");
                    }
                    $product->decrement('stock', $item['quantity']);
                    $product->stockMovements()->create([
                        'type' => 'saida',
                        'quantity' => $item['quantity'],
                        'reference_type' => 'order',
                        'reference_id' => $order->id,
                        'description' => "Venda #{$order->number}"
                    ]);
                }
            }

            // Registra o histórico
            $order->history()->create([
                'type' => 'created',
                'description' => 'Pedido criado',
                'user_id' => Auth::id()
            ]);

            DB::commit();

            return redirect()->route('orders.show', $order->id)
                ->with('success', 'Venda criada com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }
    }

    public function show(Order $order)
    {
        $order->load(['customer', 'items.product', 'items.variation', 'history.user']);

        return Inertia::render('Orders/Show', [
            'order' => $order
        ]);
    }

    public function cancel(Order $order)
    {
        if ($order->status === 'cancelled') {
            return back()->with('error', 'Este pedido já está cancelado.');
        }

        if ($order->status === 'completed') {
            return back()->with('error', 'Não é possível cancelar um pedido concluído.');
        }

        DB::beginTransaction();

        try {
            // Estorna o estoque
            foreach ($order->items as $item) {
                if ($item->product_variation_id) {
                    $variation = $item->variation;
                    $variation->increment('stock', $item->quantity);
                    $variation->stockMovements()->create([
                        'type' => 'entrada',
                        'quantity' => $item->quantity,
                        'reference_type' => 'order_cancel',
                        'reference_id' => $order->id,
                        'description' => "Estorno da venda #{$order->number}"
                    ]);
                } else {
                    $product = $item->product;
                    $product->increment('stock', $item->quantity);
                    $product->stockMovements()->create([
                        'type' => 'entrada',
                        'quantity' => $item->quantity,
                        'reference_type' => 'order_cancel',
                        'reference_id' => $order->id,
                        'description' => "Estorno da venda #{$order->number}"
                    ]);
                }
            }

            // Atualiza o status do pedido
            $order->update(['status' => 'cancelled']);

            // Registra o histórico
            $order->history()->create([
                'type' => 'cancelled',
                'description' => 'Pedido cancelado',
                'user_id' => Auth::id()
            ]);

            DB::commit();

            return back()->with('success', 'Pedido cancelado com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao cancelar o pedido.');
        }
    }

    public function print(Order $order)
    {
        $order->load(['customer', 'items.product', 'items.variation']);

        return Inertia::render('Orders/Print', [
            'order' => $order
        ]);
    }
}
