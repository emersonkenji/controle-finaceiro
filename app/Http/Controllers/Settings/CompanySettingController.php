<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanySettingController extends Controller
{
    public function index()
    {
        $settings = [
            'company_name' => config('company.name'),
            'company_document' => config('company.document'),
            'company_email' => config('company.email'),
            'company_phone' => config('company.phone'),
            'company_address' => config('company.address'),
            'company_city' => config('company.city'),
            'company_state' => config('company.state'),
            'company_zip' => config('company.zip'),
            'company_logo' => config('company.logo'),
        ];

        return Inertia::render('Settings/Company/Index', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'company_document' => 'required|string|max:20',
            'company_email' => 'required|email|max:255',
            'company_phone' => 'required|string|max:20',
            'company_address' => 'required|string|max:255',
            'company_city' => 'required|string|max:100',
            'company_state' => 'required|string|size:2',
            'company_zip' => 'required|string|max:10',
            'company_logo' => 'nullable|image|max:2048',
        ]);

        // Upload do logo se fornecido
        if ($request->hasFile('company_logo')) {
            $path = $request->file('company_logo')->store('public/company');
            $validated['company_logo'] = str_replace('public/', 'storage/', $path);
        }

        // Atualiza o arquivo .env
        $this->updateEnvironmentFile([
            'COMPANY_NAME' => $validated['company_name'],
            'COMPANY_DOCUMENT' => $validated['company_document'],
            'COMPANY_EMAIL' => $validated['company_email'],
            'COMPANY_PHONE' => $validated['company_phone'],
            'COMPANY_ADDRESS' => $validated['company_address'],
            'COMPANY_CITY' => $validated['company_city'],
            'COMPANY_STATE' => $validated['company_state'],
            'COMPANY_ZIP' => $validated['company_zip'],
            'COMPANY_LOGO' => $validated['company_logo'] ?? config('company.logo'),
        ]);

        return redirect()->back()->with('success', 'Informações da empresa atualizadas com sucesso.');
    }

    protected function updateEnvironmentFile($data)
    {
        $path = base_path('.env');
        $content = file_get_contents($path);

        foreach ($data as $key => $value) {
            // Escapa caracteres especiais no valor
            $value = str_replace('"', '\\"', $value);

            // Procura a linha existente e a substitui
            if (strpos($content, "{$key}=") !== false) {
                $content = preg_replace(
                    "/^{$key}=.*/m",
                    "{$key}=\"{$value}\"",
                    $content
                );
            } else {
                // Adiciona nova linha se a chave não existir
                $content .= "\n{$key}=\"{$value}\"";
            }
        }

        file_put_contents($path, $content);
    }
}
