import { useState } from 'react';
import {
    Lock,
    Key,
    Shield,
    AlertTriangle,
    Check,
    X
} from 'lucide-react';

export default function SecuritySettings() {
    const [settings, setSettings] = useState({
        passwordPolicy: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
            expirationDays: 90,
            preventReuse: 5
        },
        loginPolicy: {
            maxAttempts: 5,
            lockoutDuration: 30,
            requireTwoFactor: false,
            rememberDevice: true,
            sessionTimeout: 60
        },
        accessControl: {
            ipWhitelist: ['192.168.1.0/24'],
            allowedTimeStart: '08:00',
            allowedTimeEnd: '18:00',
            allowWeekends: false
        }
    });

    const [showResetModal, setShowResetModal] = useState(false);

    const handleChange = (section, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleReset = () => {
        // Aqui você enviaria uma requisição para redefinir as configurações
        setShowResetModal(false);
    };

    return (
        <div className="space-y-8">
            {/* Política de Senhas */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Política de Senhas
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Comprimento Mínimo
                        </label>
                        <input
                            type="number"
                            value={settings.passwordPolicy.minLength}
                            onChange={(e) => handleChange('passwordPolicy', 'minLength', parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.passwordPolicy.requireUppercase}
                                onChange={(e) => handleChange('passwordPolicy', 'requireUppercase', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Exigir letra maiúscula
                            </span>
                        </label>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.passwordPolicy.requireLowercase}
                                onChange={(e) => handleChange('passwordPolicy', 'requireLowercase', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Exigir letra minúscula
                            </span>
                        </label>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.passwordPolicy.requireNumbers}
                                onChange={(e) => handleChange('passwordPolicy', 'requireNumbers', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Exigir números
                            </span>
                        </label>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.passwordPolicy.requireSpecialChars}
                                onChange={(e) => handleChange('passwordPolicy', 'requireSpecialChars', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Exigir caracteres especiais
                            </span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Expiração da Senha (dias)
                        </label>
                        <input
                            type="number"
                            value={settings.passwordPolicy.expirationDays}
                            onChange={(e) => handleChange('passwordPolicy', 'expirationDays', parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Histórico de Senhas (evitar reutilização)
                        </label>
                        <input
                            type="number"
                            value={settings.passwordPolicy.preventReuse}
                            onChange={(e) => handleChange('passwordPolicy', 'preventReuse', parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Política de Login */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Política de Login
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tentativas Máximas de Login
                        </label>
                        <input
                            type="number"
                            value={settings.loginPolicy.maxAttempts}
                            onChange={(e) => handleChange('loginPolicy', 'maxAttempts', parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Duração do Bloqueio (minutos)
                        </label>
                        <input
                            type="number"
                            value={settings.loginPolicy.lockoutDuration}
                            onChange={(e) => handleChange('loginPolicy', 'lockoutDuration', parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.loginPolicy.requireTwoFactor}
                                onChange={(e) => handleChange('loginPolicy', 'requireTwoFactor', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Exigir autenticação de dois fatores
                            </span>
                        </label>
                    </div>

                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.loginPolicy.rememberDevice}
                                onChange={(e) => handleChange('loginPolicy', 'rememberDevice', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Permitir "Lembrar deste dispositivo"
                            </span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tempo Limite da Sessão (minutos)
                        </label>
                        <input
                            type="number"
                            value={settings.loginPolicy.sessionTimeout}
                            onChange={(e) => handleChange('loginPolicy', 'sessionTimeout', parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Controle de Acesso */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Controle de Acesso
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Lista de IPs Permitidos
                        </label>
                        <div className="mt-1 flex gap-2">
                            <input
                                type="text"
                                value={settings.accessControl.ipWhitelist.join(', ')}
                                onChange={(e) => handleChange('accessControl', 'ipWhitelist', e.target.value.split(', '))}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Ex: 192.168.1.0/24, 10.0.0.0/8"
                            />
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            Separe múltiplos IPs/ranges com vírgula
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Horário de Início
                            </label>
                            <input
                                type="time"
                                value={settings.accessControl.allowedTimeStart}
                                onChange={(e) => handleChange('accessControl', 'allowedTimeStart', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Horário de Término
                            </label>
                            <input
                                type="time"
                                value={settings.accessControl.allowedTimeEnd}
                                onChange={(e) => handleChange('accessControl', 'allowedTimeEnd', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.accessControl.allowWeekends}
                                onChange={(e) => handleChange('accessControl', 'allowWeekends', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Permitir acesso nos finais de semana
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-3">
                <button
                    onClick={() => setShowResetModal(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                    <AlertTriangle className="h-4 w-4 mr-1.5" />
                    Redefinir Padrões
                </button>
            </div>

            {/* Modal de Confirmação de Reset */}
            {showResetModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                <h3 className="text-lg font-medium text-gray-900">
                                    Confirmar Redefinição
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowResetModal(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="px-6 py-4">
                            <p className="text-sm text-gray-600">
                                Tem certeza que deseja redefinir todas as configurações de segurança para os valores padrão? Esta ação não pode ser desfeita.
                            </p>
                        </div>

                        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => setShowResetModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleReset}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm"
                            >
                                <AlertTriangle className="h-4 w-4 mr-1.5" />
                                Redefinir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
