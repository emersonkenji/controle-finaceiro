<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run()
    {
        $settings = [
            // Configurações da Empresa
            [
                'group' => 'company',
                'key' => 'company.name',
                'value' => 'Minha Empresa'
            ],
            [
                'group' => 'company',
                'key' => 'company.cnpj',
                'value' => ''
            ],
            [
                'group' => 'company',
                'key' => 'company.phone',
                'value' => ''
            ],
            [
                'group' => 'company',
                'key' => 'company.email',
                'value' => ''
            ],
            [
                'group' => 'company',
                'key' => 'company.address',
                'value' => [
                    'street' => '',
                    'number' => '',
                    'complement' => '',
                    'neighborhood' => '',
                    'city' => '',
                    'state' => '',
                    'zip' => ''
                ]
            ],

            // Configurações de Impostos
            [
                'group' => 'tax',
                'key' => 'tax.regime',
                'value' => 'simples'
            ],
            [
                'group' => 'tax',
                'key' => 'tax.icms',
                'value' => 0
            ],
            [
                'group' => 'tax',
                'key' => 'tax.pis',
                'value' => 0
            ],
            [
                'group' => 'tax',
                'key' => 'tax.cofins',
                'value' => 0
            ],

            // Configurações de Email
            [
                'group' => 'email',
                'key' => 'email.driver',
                'value' => 'smtp'
            ],
            [
                'group' => 'email',
                'key' => 'email.host',
                'value' => ''
            ],
            [
                'group' => 'email',
                'key' => 'email.port',
                'value' => 587
            ],
            [
                'group' => 'email',
                'key' => 'email.username',
                'value' => ''
            ],
            [
                'group' => 'email',
                'key' => 'email.password',
                'value' => ''
            ],
            [
                'group' => 'email',
                'key' => 'email.encryption',
                'value' => 'tls'
            ],

            // Configurações de Backup
            [
                'group' => 'backup',
                'key' => 'backup.frequency',
                'value' => 'daily'
            ],
            [
                'group' => 'backup',
                'key' => 'backup.retention',
                'value' => 7
            ],
            [
                'group' => 'backup',
                'key' => 'backup.storage',
                'value' => 'local'
            ],

            // Configurações de Integrações
            [
                'group' => 'integrations',
                'key' => 'integrations.payment_gateway',
                'value' => []
            ],
            [
                'group' => 'integrations',
                'key' => 'integrations.shipping',
                'value' => []
            ],
            [
                'group' => 'integrations',
                'key' => 'integrations.nfe',
                'value' => []
            ],

            // Configurações de Notificações
            [
                'group' => 'notifications',
                'key' => 'notifications.email',
                'value' => [
                    'newSale' => true,
                    'lowStock' => true,
                    'paymentReceived' => true,
                    'paymentOverdue' => true,
                    'newClient' => false,
                    'dailySummary' => true,
                    'weeklySummary' => false,
                    'monthlySummary' => true
                ]
            ],
            [
                'group' => 'notifications',
                'key' => 'notifications.push',
                'value' => [
                    'newSale' => true,
                    'lowStock' => true,
                    'paymentReceived' => true,
                    'paymentOverdue' => true,
                    'newClient' => true,
                    'dailySummary' => false,
                    'weeklySummary' => false,
                    'monthlySummary' => false
                ]
            ],
            [
                'group' => 'notifications',
                'key' => 'notifications.sms',
                'value' => [
                    'newSale' => false,
                    'lowStock' => false,
                    'paymentReceived' => false,
                    'paymentOverdue' => true,
                    'newClient' => false,
                    'dailySummary' => false,
                    'weeklySummary' => false,
                    'monthlySummary' => false
                ]
            ]
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
