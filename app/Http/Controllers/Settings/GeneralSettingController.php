<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GeneralSettingController extends Controller
{
    public function index()
    {
        $settings = [
            'app_name' => config('app.name'),
            'timezone' => config('app.timezone'),
            'locale' => config('app.locale'),
            'currency' => config('app.currency', 'BRL'),
            'date_format' => config('app.date_format', 'd/m/Y'),
            'time_format' => config('app.time_format', 'H:i'),
        ];

        return Inertia::render('Settings/General/Index', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'app_name' => 'required|string|max:255',
            'timezone' => 'required|string|timezone',
            'locale' => 'required|string|in:pt_BR,en',
            'currency' => 'required|string|size:3',
            'date_format' => 'required|string',
            'time_format' => 'required|string',
        ]);

        // Atualiza o arquivo .env
        $this->updateEnvironmentFile([
            'APP_NAME' => $validated['app_name'],
            'APP_TIMEZONE' => $validated['timezone'],
            'APP_LOCALE' => $validated['locale'],
            'APP_CURRENCY' => $validated['currency'],
            'APP_DATE_FORMAT' => $validated['date_format'],
            'APP_TIME_FORMAT' => $validated['time_format'],
        ]);

        return redirect()->back()->with('success', 'Configurações atualizadas com sucesso.');
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
