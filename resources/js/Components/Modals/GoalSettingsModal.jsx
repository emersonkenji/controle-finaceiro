import { useState } from 'react';
import {
    Target,
    Plus,
    Trash2,
    X,
    Save,
    AlertTriangle
} from 'lucide-react';

export default function GoalSettingsModal({ isOpen, onClose, onSave }) {
    const [goals, setGoals] = useState([
        {
            id: 1,
            type: 'sales',
            title: 'Meta de Vendas',
            target: 180000.00,
            period: 'month',
            alertThreshold: 80
        },
        {
            id: 2,
            type: 'customers',
            title: 'Novos Clientes',
            target: 50,
            period: 'month',
            alertThreshold: 70
        },
        {
            id: 3,
            type: 'revenue',
            title: 'Receita',
            target: 200000.00,
            period: 'month',
            alertThreshold: 85
        }
    ]);

    const [newGoal, setNewGoal] = useState({
        type: 'custom',
        title: '',
        target: '',
        period: 'month',
        alertThreshold: 80
    });

    const handleAddGoal = () => {
        if (newGoal.title && newGoal.target) {
            setGoals([
                ...goals,
                {
                    ...newGoal,
                    id: Math.max(...goals.map(g => g.id)) + 1
                }
            ]);
            setNewGoal({
                type: 'custom',
                title: '',
                target: '',
                period: 'month',
                alertThreshold: 80
            });
        }
    };

    const handleRemoveGoal = (id) => {
        setGoals(goals.filter(goal => goal.id !== id));
    };

    const handleUpdateGoal = (id, field, value) => {
        setGoals(goals.map(goal =>
            goal.id === id ? { ...goal, [field]: value } : goal
        ));
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                {/* Cabeçalho */}
                <div className="px-6 py-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-medium text-gray-900">Configurar Metas</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="px-6 py-4 max-h-[calc(90vh-8rem)] overflow-y-auto">
                    {/* Metas Existentes */}
                    <div className="space-y-4 mb-6">
                        {goals.map((goal) => (
                            <div key={goal.id} className="border rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Título
                                        </label>
                                        <input
                                            type="text"
                                            value={goal.title}
                                            onChange={(e) => handleUpdateGoal(goal.id, 'title', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Meta
                                        </label>
                                        <input
                                            type="number"
                                            value={goal.target}
                                            onChange={(e) => handleUpdateGoal(goal.id, 'target', parseFloat(e.target.value))}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Período
                                        </label>
                                        <select
                                            value={goal.period}
                                            onChange={(e) => handleUpdateGoal(goal.id, 'period', e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="week">Semanal</option>
                                            <option value="month">Mensal</option>
                                            <option value="quarter">Trimestral</option>
                                            <option value="year">Anual</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Alerta (%)
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                value={goal.alertThreshold}
                                                onChange={(e) => handleUpdateGoal(goal.id, 'alertThreshold', parseInt(e.target.value))}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                min="0"
                                                max="100"
                                            />
                                            <button
                                                onClick={() => handleRemoveGoal(goal.id)}
                                                className="p-2 text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Nova Meta */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="text-sm font-medium text-gray-700 mb-4">Adicionar Nova Meta</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Título
                                </label>
                                <input
                                    type="text"
                                    value={newGoal.title}
                                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Nome da meta"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Meta
                                </label>
                                <input
                                    type="number"
                                    value={newGoal.target}
                                    onChange={(e) => setNewGoal({ ...newGoal, target: parseFloat(e.target.value) })}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Valor"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Período
                                </label>
                                <select
                                    value={newGoal.period}
                                    onChange={(e) => setNewGoal({ ...newGoal, period: e.target.value })}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="week">Semanal</option>
                                    <option value="month">Mensal</option>
                                    <option value="quarter">Trimestral</option>
                                    <option value="year">Anual</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Alerta (%)
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={newGoal.alertThreshold}
                                        onChange={(e) => setNewGoal({ ...newGoal, alertThreshold: parseInt(e.target.value) })}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        min="0"
                                        max="100"
                                    />
                                    <button
                                        onClick={handleAddGoal}
                                        className="p-2 text-blue-600 hover:text-blue-700"
                                        disabled={!newGoal.title || !newGoal.target}
                                    >
                                        <Plus className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rodapé */}
                <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onSave(goals)}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
}
