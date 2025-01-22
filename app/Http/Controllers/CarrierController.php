<?php

namespace App\Http\Controllers;

use App\Models\Carrier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CarrierController extends Controller
{
    public function index()
    {
        $carriers = Carrier::query()
            ->withCount('deliveries')
            ->when(request('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('document', 'like', "%{$search}%");
            })
            ->when(request('status'), function ($query, $status) {
                if ($status !== 'all') {
                    $query->where('status', $status);
                }
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('Logistics/Carriers/Index', [
            'carriers' => $carriers,
            'filters' => request()->only(['search', 'status'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Logistics/Carriers/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'document' => 'required|string|max:20',
            'contact_name' => 'required|string|max:255',
            'contact_phone' => 'required|string|max:20',
            'contact_email' => 'required|email|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:2',
            'zip_code' => 'required|string|max:10',
            'status' => 'required|in:active,inactive',
            'notes' => 'nullable|string'
        ]);

        Carrier::create($validated);

        return redirect()->route('logistics.carriers.index')
            ->with('success', 'Transportadora criada com sucesso.');
    }

    public function show(Carrier $carrier)
    {
        return Inertia::render('Logistics/Carriers/Show', [
            'carrier' => $carrier->load(['deliveries' => function ($query) {
                $query->latest()->take(5);
            }])
        ]);
    }

    public function edit(Carrier $carrier)
    {
        return Inertia::render('Logistics/Carriers/Edit', [
            'carrier' => $carrier
        ]);
    }

    public function update(Request $request, Carrier $carrier)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'document' => 'required|string|max:20',
            'contact_name' => 'required|string|max:255',
            'contact_phone' => 'required|string|max:20',
            'contact_email' => 'required|email|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:2',
            'zip_code' => 'required|string|max:10',
            'status' => 'required|in:active,inactive',
            'notes' => 'nullable|string'
        ]);

        $carrier->update($validated);

        return redirect()->route('logistics.carriers.index')
            ->with('success', 'Transportadora atualizada com sucesso.');
    }

    public function destroy(Carrier $carrier)
    {
        $carrier->delete();

        return redirect()->route('logistics.carriers.index')
            ->with('success', 'Transportadora excluída com sucesso.');
    }
}
