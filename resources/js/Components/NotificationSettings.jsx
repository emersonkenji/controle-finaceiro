import { useState } from 'react';
import {
    Bell,
    Mail,
    MessageSquare,
    Smartphone,
    AlertTriangle,
    Check,
    X
} from 'lucide-react';

export default function NotificationSettings() {
    const [settings, setSettings] = useState({
        email: {
            newSale: true,
            lowStock: true,
            paymentReceived: true,
            paymentOverdue: true,
            newClient: false,
            dailySummary: true,
            weeklySummary: false,
            monthlySummary: true
        },
        push: {
            newSale: true,
            lowStock: true,
            paymentReceived: true,
            paymentOverdue: true,
            newClient: true,
            dailySummary: false,
            weeklySummary: false,
            monthlySummary: false
        },
        sms: {
            newSale: false,
            lowStock: false,
            paymentReceived: false,
            paymentOverdue: true,
            newClient: false,
            dailySummary: false,
            weeklySummary: false,
            monthlySummary: false
        }
    });

    const [showResetModal, setShowResetModal] = useState(false);

    const handleChange = (channel, notification, value) => {
        setSettings(prev => ({
            ...prev,
            [channel]: {
                ...prev[channel],
                [notification]: value
            }
        }));
    };

    const handleReset = () => {
        // Aqui você enviaria uma requisição para redefinir as configurações
        setShowResetModal(false);
    };

    const notifications = [
        { id: 'newSale', name: 'Nova Venda' },
        { id: 'lowStock', name: 'Estoque Baixo' },
        { id: 'paymentReceived', name: 'Pagamento Recebido' },
        { id: 'paymentOverdue', name: 'Pagamento Atrasado' },
        { id: 'newClient', name: 'Novo Cliente' },
        { id: 'dailySummary', name: 'Resumo Diário' },
        { id: 'weeklySummary', name: 'Resumo Semanal' },
        { id: 'monthlySummary', name: 'Resumo Mensal' }
    ];

    return (
        <div className="space-y-8">
            {/* Notificações por Email */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">
                        Notificações por Email
                    </h3>
                </div>
                <div className="space-y-4">
                    {notifications.map(notification => (
                        <label key={notification.id} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.email[notification.id]}
                                onChange={(e) => handleChange('email', notification.id, e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                {notification.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Notificações Push */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Bell className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">
                        Notificações Push
                    </h3>
                </div>
                <div className="space-y-4">
                    {notifications.map(notification => (
                        <label key={notification.id} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.push[notification.id]}
                                onChange={(e) => handleChange('push', notification.id, e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                {notification.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Notificações SMS */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Smartphone className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">
                        Notificações SMS
                    </h3>
                </div>
                <div className="space-y-4">
                    {notifications.map(notification => (
                        <label key={notification.id} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.sms[notification.id]}
                                onChange={(e) => handleChange('sms', notification.id, e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                {notification.name}
                            </span>
                        </label>
                    ))}
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
                                Tem certeza que deseja redefinir todas as configurações de notificação para os valores padrão? Esta ação não pode ser desfeita.
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
