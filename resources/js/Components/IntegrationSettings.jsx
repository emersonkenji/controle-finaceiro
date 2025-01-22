import { useState } from 'react';
import {
    Database,
    CreditCard,
    Truck,
    Mail,
    MessageSquare,
    AlertTriangle,
    Check,
    X,
    Plus,
    Trash2
} from 'lucide-react';

export default function IntegrationSettings() {
    const [settings, setSettings] = useState({
        payment: {
            mercadoPago: {
                enabled: true,
                accessToken: '********',
                publicKey: '********',
                sandbox: true
            },
            pagseguro: {
                enabled: false,
                email: '',
                token: '',
                sandbox: true
            },
            stripe: {
                enabled: false,
                secretKey: '',
                publicKey: '',
                sandbox: true
            }
        },
        shipping: {
            correios: {
                enabled: true,
                username: '********',
                password: '********',
                contract: '********',
                sandbox: false
            },
            jadlog: {
                enabled: false,
                token: '',
                sandbox: true
            }
        },
        email: {
            smtp: {
                enabled: true,
                host: 'smtp.gmail.com',
                port: 587,
                username: '********',
                password: '********',
                encryption: 'tls'
            },
            sendgrid: {
                enabled: false,
                apiKey: '',
                fromEmail: '',
                fromName: ''
            }
        },
        chat: {
            whatsapp: {
                enabled: true,
                token: '********',
                phoneNumber: '********'
            },
            telegram: {
                enabled: false,
                token: '',
                botUsername: ''
            }
        }
    });

    const [showResetModal, setShowResetModal] = useState(false);
    const [showWebhooks, setShowWebhooks] = useState(false);
    const [webhooks, setWebhooks] = useState([
        { id: 1, url: 'https://example.com/webhook1', events: ['payment.success', 'payment.failure'] },
        { id: 2, url: 'https://example.com/webhook2', events: ['shipping.created', 'shipping.updated'] }
    ]);

    const handleChange = (section, service, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [service]: {
                    ...prev[section][service],
                    [field]: value
                }
            }
        }));
    };

    const handleReset = () => {
        // Aqui você enviaria uma requisição para redefinir as configurações
        setShowResetModal(false);
    };

    const handleAddWebhook = () => {
        const newWebhook = {
            id: webhooks.length + 1,
            url: '',
            events: []
        };
        setWebhooks([...webhooks, newWebhook]);
    };

    const handleRemoveWebhook = (id) => {
        setWebhooks(webhooks.filter(webhook => webhook.id !== id));
    };

    return (
        <div className="space-y-8">
            {/* Integrações de Pagamento */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">
                        Integrações de Pagamento
                    </h3>
                </div>
                <div className="space-y-6">
                    {/* Mercado Pago */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.payment.mercadoPago.enabled}
                                    onChange={(e) => handleChange('payment', 'mercadoPago', 'enabled', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm font-medium text-gray-900">
                                    Mercado Pago
                                </span>
                            </div>
                            <div className="flex items-center">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={settings.payment.mercadoPago.sandbox}
                                        onChange={(e) => handleChange('payment', 'mercadoPago', 'sandbox', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">
                                        Ambiente de Teste
                                    </span>
                                </label>
                            </div>
                        </div>
                        {settings.payment.mercadoPago.enabled && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Access Token
                                    </label>
                                    <input
                                        type="password"
                                        value={settings.payment.mercadoPago.accessToken}
                                        onChange={(e) => handleChange('payment', 'mercadoPago', 'accessToken', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Public Key
                                    </label>
                                    <input
                                        type="password"
                                        value={settings.payment.mercadoPago.publicKey}
                                        onChange={(e) => handleChange('payment', 'mercadoPago', 'publicKey', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* PagSeguro */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.payment.pagseguro.enabled}
                                    onChange={(e) => handleChange('payment', 'pagseguro', 'enabled', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm font-medium text-gray-900">
                                    PagSeguro
                                </span>
                            </div>
                            <div className="flex items-center">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={settings.payment.pagseguro.sandbox}
                                        onChange={(e) => handleChange('payment', 'pagseguro', 'sandbox', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">
                                        Ambiente de Teste
                                    </span>
                                </label>
                            </div>
                        </div>
                        {settings.payment.pagseguro.enabled && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={settings.payment.pagseguro.email}
                                        onChange={(e) => handleChange('payment', 'pagseguro', 'email', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Token
                                    </label>
                                    <input
                                        type="password"
                                        value={settings.payment.pagseguro.token}
                                        onChange={(e) => handleChange('payment', 'pagseguro', 'token', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Integrações de Envio */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Truck className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">
                        Integrações de Envio
                    </h3>
                </div>
                <div className="space-y-6">
                    {/* Correios */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.shipping.correios.enabled}
                                    onChange={(e) => handleChange('shipping', 'correios', 'enabled', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm font-medium text-gray-900">
                                    Correios
                                </span>
                            </div>
                            <div className="flex items-center">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={settings.shipping.correios.sandbox}
                                        onChange={(e) => handleChange('shipping', 'correios', 'sandbox', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">
                                        Ambiente de Teste
                                    </span>
                                </label>
                            </div>
                        </div>
                        {settings.shipping.correios.enabled && (
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Usuário
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.shipping.correios.username}
                                        onChange={(e) => handleChange('shipping', 'correios', 'username', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Senha
                                    </label>
                                    <input
                                        type="password"
                                        value={settings.shipping.correios.password}
                                        onChange={(e) => handleChange('shipping', 'correios', 'password', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Código do Contrato
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.shipping.correios.contract}
                                        onChange={(e) => handleChange('shipping', 'correios', 'contract', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Integrações de Email */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">
                        Integrações de Email
                    </h3>
                </div>
                <div className="space-y-6">
                    {/* SMTP */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                checked={settings.email.smtp.enabled}
                                onChange={(e) => handleChange('email', 'smtp', 'enabled', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-900">
                                SMTP
                            </span>
                        </div>
                        {settings.email.smtp.enabled && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Host
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.email.smtp.host}
                                        onChange={(e) => handleChange('email', 'smtp', 'host', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Porta
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.email.smtp.port}
                                        onChange={(e) => handleChange('email', 'smtp', 'port', parseInt(e.target.value))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Usuário
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.email.smtp.username}
                                        onChange={(e) => handleChange('email', 'smtp', 'username', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Senha
                                    </label>
                                    <input
                                        type="password"
                                        value={settings.email.smtp.password}
                                        onChange={(e) => handleChange('email', 'smtp', 'password', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Criptografia
                                    </label>
                                    <select
                                        value={settings.email.smtp.encryption}
                                        onChange={(e) => handleChange('email', 'smtp', 'encryption', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="tls">TLS</option>
                                        <option value="ssl">SSL</option>
                                        <option value="none">Nenhuma</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Webhooks */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900">
                            Webhooks
                        </h3>
                    </div>
                    <button
                        onClick={() => setShowWebhooks(!showWebhooks)}
                        className="text-sm text-blue-600 hover:text-blue-500"
                    >
                        {showWebhooks ? 'Ocultar' : 'Mostrar'}
                    </button>
                </div>
                {showWebhooks && (
                    <div className="space-y-4">
                        {webhooks.map((webhook) => (
                            <div key={webhook.id} className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-medium text-gray-900">
                                        Webhook #{webhook.id}
                                    </h4>
                                    <button
                                        onClick={() => handleRemoveWebhook(webhook.id)}
                                        className="text-red-600 hover:text-red-500"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            URL
                                        </label>
                                        <input
                                            type="url"
                                            value={webhook.url}
                                            onChange={(e) => {
                                                const newWebhooks = webhooks.map(w =>
                                                    w.id === webhook.id ? { ...w, url: e.target.value } : w
                                                );
                                                setWebhooks(newWebhooks);
                                            }}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Eventos
                                        </label>
                                        <div className="mt-2 space-y-2">
                                            {['payment.success', 'payment.failure', 'shipping.created', 'shipping.updated'].map((event) => (
                                                <label key={event} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={webhook.events.includes(event)}
                                                        onChange={(e) => {
                                                            const newWebhooks = webhooks.map(w => {
                                                                if (w.id === webhook.id) {
                                                                    const events = e.target.checked
                                                                        ? [...w.events, event]
                                                                        : w.events.filter(e => e !== event);
                                                                    return { ...w, events };
                                                                }
                                                                return w;
                                                            });
                                                            setWebhooks(newWebhooks);
                                                        }}
                                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-600">
                                                        {event}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={handleAddWebhook}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100"
                        >
                            <Plus className="h-4 w-4 mr-1.5" />
                            Adicionar Webhook
                        </button>
                    </div>
                )}
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
                                Tem certeza que deseja redefinir todas as configurações de integração para os valores padrão? Esta ação não pode ser desfeita.
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
