<?php

namespace App\Http\Controllers\Products;

use Inertia\Inertia;
use App\Models\Delivery;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DeliveryController extends Controller
{
    public function index()
    {
        $deliveries = Delivery::query()
            ->with(['carrier', 'order'])
            ->when(request('search'), function ($query, $search) {
                $query->where('tracking_code', 'like', "%{$search}%");
            })
            ->when(request('status'), function ($query, $status) {
                if ($status !== 'all') {
                    $query->where('status', $status);
                }
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('Logistics/Deliveries/Index', [
            'deliveries' => $deliveries,
            'filters' => request()->only(['search', 'status'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Logistics/Deliveries/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'carrier_id' => 'required|exists:carriers,id',
            'tracking_code' => 'required|string|max:255',
            'estimated_delivery' => 'required|date',
            'notes' => 'nullable|string'
        ]);

        Delivery::create($validated);

        return redirect()->route('logistics.deliveries.index')
            ->with('success', 'Entrega criada com sucesso.');
    }

    public function show(Delivery $delivery)
    {
        return Inertia::render('Logistics/Deliveries/Show', [
            'delivery' => $delivery->load(['carrier', 'order'])
        ]);
    }

    public function edit(Delivery $delivery)
    {
        return Inertia::render('Logistics/Deliveries/Edit', [
            'delivery' => $delivery->load(['carrier', 'order'])
        ]);
    }

    public function update(Request $request, Delivery $delivery)
    {
        $validated = $request->validate([
            'carrier_id' => 'required|exists:carriers,id',
            'tracking_code' => 'required|string|max:255',
            'estimated_delivery' => 'required|date',
            'status' => 'required|in:pending,in_transit,delivered,cancelled',
            'notes' => 'nullable|string'
        ]);

        $delivery->update($validated);

        return redirect()->route('logistics.deliveries.index')
            ->with('success', 'Entrega atualizada com sucesso.');
    }

    public function destroy(Delivery $delivery)
    {
        $delivery->delete();

        return redirect()->route('logistics.deliveries.index')
            ->with('success', 'Entrega excluída com sucesso.');
    }

    public function tracking()
    {
        $deliveries = Delivery::query()
            ->with(['carrier', 'order'])
            ->where('status', 'in_transit')
            ->get();

        return Inertia::render('Logistics/Tracking/Index', [
            'deliveries' => $deliveries
        ]);
    }
}
