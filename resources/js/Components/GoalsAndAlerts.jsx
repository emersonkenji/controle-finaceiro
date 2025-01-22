import { useState } from 'react';
import {
    Target,
    Bell,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Settings
} from 'lucide-react';
import GoalSettingsModal from '@/Components/Modals/GoalSettingsModal';

export default function GoalsAndAlerts() {
    const [showAll, setShowAll] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // Dados de exemplo - posteriormente virão do backend
    const goals = [
        {
            id: 1,
            type: 'sales',
            title: 'Meta de Vendas',
            target: 180000.00,
            current: 156800.00,
            period: 'Mensal',
            progress: 87,
            status: 'on-track'
        },
        {
            id: 2,
            type: 'customers',
            title: 'Novos Clientes',
            target: 50,
            current: 12,
            period: 'Mensal',
            progress: 24,
            status: 'at-risk'
        },
        {
            id: 3,
            type: 'revenue',
            title: 'Receita',
            target: 200000.00,
            current: 168500.00,
            period: 'Mensal',
            progress: 84,
            status: 'on-track'
        }
    ];

    const alerts = [
        {
            id: 1,
            type: 'stock',
            title: 'Estoque Baixo',
            message: '15 produtos precisam de reposição',
            severity: 'high',
            timestamp: new Date()
        },
        {
            id: 2,
            type: 'payment',
            title: 'Contas a Pagar',
            message: '5 faturas vencem esta semana',
            severity: 'medium',
            timestamp: new Date()
        },
        {
            id: 3,
            type: 'goal',
            title: 'Meta de Novos Clientes',
            message: 'Meta mensal em risco',
            severity: 'low',
            timestamp: new Date()
        }
    ];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'on-track':
                return 'text-green-500';
            case 'at-risk':
                return 'text-yellow-500';
            case 'behind':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high':
                return 'bg-red-50 border-red-200';
            case 'medium':
                return 'bg-yellow-50 border-yellow-200';
            case 'low':
                return 'bg-blue-50 border-blue-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const getSeverityIcon = (severity) => {
        switch (severity) {
            case 'high':
                return <AlertTriangle className="h-5 w-5 text-red-500" />;
            case 'medium':
                return <Bell className="h-5 w-5 text-yellow-500" />;
            case 'low':
                return <Target className="h-5 w-5 text-blue-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-gray-500" />
                    <h3 className="text-lg font-medium text-gray-900">Metas e Alertas</h3>
                </div>
                <button
                    onClick={() => setShowSettings(true)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                >
                    <Settings className="h-5 w-5 text-gray-500" />
                </button>
            </div>

            {/* Metas */}
            <div className="space-y-4">
                {goals.map((goal) => (
                    <div key={goal.id} className="bg-white border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{goal.title}</h4>
                            <span className="text-sm text-gray-500">{goal.period}</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">
                                    {typeof goal.current === 'number' && goal.current > 1000
                                        ? formatCurrency(goal.current)
                                        : goal.current}
                                    {' / '}
                                    {typeof goal.target === 'number' && goal.target > 1000
                                        ? formatCurrency(goal.target)
                                        : goal.target}
                                </span>
                                <span className={getStatusColor(goal.status)}>
                                    {goal.progress}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${
                                        goal.status === 'on-track'
                                            ? 'bg-green-500'
                                            : goal.status === 'at-risk'
                                            ? 'bg-yellow-500'
                                            : 'bg-red-500'
                                    }`}
                                    style={{ width: `${goal.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Alertas */}
            <div className="space-y-3">
                {alerts.slice(0, showAll ? undefined : 2).map((alert) => (
                    <div
                        key={alert.id}
                        className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
                    >
                        <div className="flex items-start gap-3">
                            {getSeverityIcon(alert.severity)}
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900">{alert.title}</p>
                                <p className="text-sm text-gray-600">{alert.message}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                ))}

                {alerts.length > 2 && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        {showAll ? 'Mostrar menos' : `Ver mais ${alerts.length - 2} alertas`}
                    </button>
                )}
            </div>

            {/* Modal de Configurações */}
            <GoalSettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                onSave={(updatedGoals) => {
                    console.log('Metas atualizadas:', updatedGoals);
                    setShowSettings(false);
                }}
            />
        </div>
    );
}
