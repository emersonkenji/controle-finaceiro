<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CustomerDocumentController extends Controller
{
    public function index(Customer $customer)
    {
        $documents = $customer->documents()
            ->with('user')
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('Customers/Documents/Index', [
            'customer' => $customer,
            'documents' => $documents
        ]);
    }

    public function store(Request $request, Customer $customer)
    {
        $request->validate([
            'document' => 'required|file|max:10240', // 10MB
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string'
        ]);

        $path = $request->file('document')->store('customers/' . $customer->id . '/documents');

        $customer->documents()->create([
            'name' => $request->name,
            'description' => $request->description,
            'path' => $path,
            'type' => $request->type,
            'size' => $request->file('document')->getSize(),
            'user_id' => auth()->id()
        ]);

        return redirect()
            ->back()
            ->with('success', 'Documento enviado com sucesso!');
    }

    public function destroy(Customer $customer, CustomerDocument $document)
    {
        if ($document->customer_id !== $customer->id) {
            abort(404);
        }

        Storage::delete($document->path);
        $document->delete();

        return redirect()
            ->back()
            ->with('success', 'Documento excluído com sucesso!');
    }

    public function download(Customer $customer, CustomerDocument $document)
    {
        if ($document->customer_id !== $customer->id) {
            abort(404);
        }

        return Storage::download($document->path, $document->name);
    }
}
