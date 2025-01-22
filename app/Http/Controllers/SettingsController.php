<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->groupBy('group');

        return Inertia::render('Settings/Index', [
            'settings' => $settings,
            'company' => $this->getCompanySettings(),
            'tax' => $this->getTaxSettings(),
            'email' => $this->getEmailSettings(),
            'backup' => $this->getBackupSettings(),
            'integrations' => $this->getIntegrationSettings(),
            'notifications' => $this->getNotificationSettings()
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'company.name' => 'required|string|max:255',
            'company.cnpj' => 'required|string|max:18',
            'company.phone' => 'required|string|max:20',
            'company.email' => 'required|email|max:255',
            'company.address' => 'required|array',
            'company.address.street' => 'required|string|max:255',
            'company.address.number' => 'required|string|max:20',
            'company.address.complement' => 'nullable|string|max:255',
            'company.address.neighborhood' => 'required|string|max:255',
            'company.address.city' => 'required|string|max:255',
            'company.address.state' => 'required|string|size:2',
            'company.address.zip' => 'required|string|size:8',

            'tax.regime' => 'required|in:simples,presumido,real',
            'tax.icms' => 'required|numeric|min:0|max:100',
            'tax.pis' => 'required|numeric|min:0|max:100',
            'tax.cofins' => 'required|numeric|min:0|max:100',

            'email.driver' => 'required|in:smtp,sendmail,mailgun,ses',
            'email.host' => 'required_if:email.driver,smtp|string|max:255',
            'email.port' => 'required_if:email.driver,smtp|integer|min:1|max:65535',
            'email.username' => 'required_if:email.driver,smtp|string|max:255',
            'email.password' => 'required_if:email.driver,smtp|string|max:255',
            'email.encryption' => 'required_if:email.driver,smtp|in:tls,ssl',

            'backup.frequency' => 'required|in:daily,weekly,monthly',
            'backup.retention' => 'required|integer|min:1|max:365',
            'backup.storage' => 'required|in:local,s3,google',

            'integrations.payment_gateway' => 'nullable|array',
            'integrations.shipping' => 'nullable|array',
            'integrations.nfe' => 'nullable|array',

            'notifications.email' => 'required|array',
            'notifications.push' => 'required|array',
            'notifications.sms' => 'required|array'
        ]);

        try {
            foreach ($validated as $group => $settings) {
                foreach ($settings as $key => $value) {
                    Setting::updateOrCreate(
                        ['group' => $group, 'key' => $key],
                        ['value' => $value]
                    );
                }
            }

            // Limpa o cache das configurações
            Cache::tags('settings')->flush();

            return redirect()->back()->with('success', 'Configurações atualizadas com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao atualizar configurações: ' . $e->getMessage());
        }
    }

    private function getCompanySettings()
    {
        return [
            'name' => setting('company.name', ''),
            'cnpj' => setting('company.cnpj', ''),
            'phone' => setting('company.phone', ''),
            'email' => setting('company.email', ''),
            'address' => setting('company.address', [
                'street' => '',
                'number' => '',
                'complement' => '',
                'neighborhood' => '',
                'city' => '',
                'state' => '',
                'zip' => ''
            ])
        ];
    }

    private function getTaxSettings()
    {
        return [
            'regime' => setting('tax.regime', 'simples'),
            'icms' => setting('tax.icms', 0),
            'pis' => setting('tax.pis', 0),
            'cofins' => setting('tax.cofins', 0)
        ];
    }

    private function getEmailSettings()
    {
        return [
            'driver' => setting('email.driver', 'smtp'),
            'host' => setting('email.host', ''),
            'port' => setting('email.port', 587),
            'username' => setting('email.username', ''),
            'password' => setting('email.password', ''),
            'encryption' => setting('email.encryption', 'tls')
        ];
    }

    private function getBackupSettings()
    {
        return [
            'frequency' => setting('backup.frequency', 'daily'),
            'retention' => setting('backup.retention', 7),
            'storage' => setting('backup.storage', 'local')
        ];
    }

    private function getIntegrationSettings()
    {
        return [
            'payment_gateway' => setting('integrations.payment_gateway', []),
            'shipping' => setting('integrations.shipping', []),
            'nfe' => setting('integrations.nfe', [])
        ];
    }

    private function getNotificationSettings()
    {
        return [
            'email' => setting('notifications.email', [
                'newSale' => true,
                'lowStock' => true,
                'paymentReceived' => true,
                'paymentOverdue' => true,
                'newClient' => false,
                'dailySummary' => true,
                'weeklySummary' => false,
                'monthlySummary' => true
            ]),
            'push' => setting('notifications.push', [
                'newSale' => true,
                'lowStock' => true,
                'paymentReceived' => true,
                'paymentOverdue' => true,
                'newClient' => true,
                'dailySummary' => false,
                'weeklySummary' => false,
                'monthlySummary' => false
            ]),
            'sms' => setting('notifications.sms', [
                'newSale' => false,
                'lowStock' => false,
                'paymentReceived' => false,
                'paymentOverdue' => true,
                'newClient' => false,
                'dailySummary' => false,
                'weeklySummary' => false,
                'monthlySummary' => false
            ])
        ];
    }
}
