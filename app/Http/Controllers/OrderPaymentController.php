<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderPaymentController extends Controller
{
    public function index(Order $order)
    {
        $order->load(['payments.user']);

        return Inertia::render('Orders/Payments/Index', [
            'order' => $order,
            'payments' => $order->payments()->with('user')->latest()->paginate(10)
        ]);
    }

    public function store(Request $request, Order $order)
    {
        if ($order->status === 'cancelled') {
            return back()->with('error', 'Não é possível adicionar pagamentos a um pedido cancelado.');
        }

        $validated = $request->validate([
            'method' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'transaction_id' => 'nullable|string',
            'notes' => 'nullable|string'
        ]);

        DB::beginTransaction();

        try {
            // Verifica se o valor não excede o saldo devedor
            $totalPaid = $order->payments()->where('status', 'approved')->sum('amount');
            $remaining = $order->total - $totalPaid;

            if ($validated['amount'] > $remaining) {
                return back()->with('error', 'O valor do pagamento excede o saldo devedor.');
            }

            $payment = $order->payments()->create([
                ...$validated,
                'user_id' => Auth::id()
            ]);

            // Atualiza o status de pagamento do pedido
            $newTotalPaid = $totalPaid + $validated['amount'];
            $paymentStatus = match(true) {
                $newTotalPaid >= $order->total => 'paid',
                $newTotalPaid > 0 => 'partial',
                default => 'pending'
            };

            $order->update(['payment_status' => $paymentStatus]);

            // Registra no histórico
            $order->history()->create([
                'type' => 'payment_added',
                'description' => "Pagamento de R$ {$validated['amount']} adicionado",
                'data' => $payment->toArray(),
                'user_id' => Auth::id()
            ]);

            DB::commit();

            return back()->with('success', 'Pagamento registrado com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao registrar pagamento.');
        }
    }

    public function update(Request $request, Order $order, OrderPayment $payment)
    {
        if ($order->status === 'cancelled') {
            return back()->with('error', 'Não é possível alterar pagamentos de um pedido cancelado.');
        }

        if ($payment->order_id !== $order->id) {
            abort(404);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,approved,declined,refunded',
            'notes' => 'nullable|string'
        ]);

        DB::beginTransaction();

        try {
            $oldStatus = $payment->status;
            $payment->update($validated);

            // Recalcula o status de pagamento do pedido
            $totalPaid = $order->payments()->where('status', 'approved')->sum('amount');
            $paymentStatus = match(true) {
                $totalPaid >= $order->total => 'paid',
                $totalPaid > 0 => 'partial',
                default => 'pending'
            };

            $order->update(['payment_status' => $paymentStatus]);

            // Registra no histórico
            $order->history()->create([
                'type' => 'payment_updated',
                'description' => "Status do pagamento alterado para {$validated['status']}",
                'data' => $payment->toArray(),
                'user_id' => Auth::id()
            ]);

            DB::commit();

            return back()->with('success', 'Status do pagamento atualizado com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao atualizar status do pagamento.');
        }
    }

    public function destroy(Order $order, OrderPayment $payment)
    {
        if ($order->status === 'cancelled') {
            return back()->with('error', 'Não é possível excluir pagamentos de um pedido cancelado.');
        }

        if ($payment->order_id !== $order->id) {
            abort(404);
        }

        if ($payment->status === 'approved') {
            return back()->with('error', 'Não é possível excluir um pagamento aprovado.');
        }

        DB::beginTransaction();

        try {
            $payment->delete();

            // Recalcula o status de pagamento do pedido
            $totalPaid = $order->payments()->where('status', 'approved')->sum('amount');
            $paymentStatus = match(true) {
                $totalPaid >= $order->total => 'paid',
                $totalPaid > 0 => 'partial',
                default => 'pending'
            };

            $order->update(['payment_status' => $paymentStatus]);

            // Registra no histórico
            $order->history()->create([
                'type' => 'payment_deleted',
                'description' => "Pagamento excluído",
                'data' => $payment->toArray(),
                'user_id' => Auth::id()
            ]);

            DB::commit();

            return back()->with('success', 'Pagamento excluído com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao excluir pagamento.');
        }
    }
}
