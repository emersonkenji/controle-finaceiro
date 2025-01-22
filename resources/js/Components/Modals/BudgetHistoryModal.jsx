import { useState } from 'react';
import { X, ArrowUp, ArrowDown, Calendar } from 'lucide-react';

export default function BudgetHistoryModal({ isOpen, onClose, department }) {
    const [period, setPeriod] = useState('month');

    // Dados de exemplo - posteriormente virão do backend
    const history = [
        {
            id: 1,
            date: '2024-02-20',
            oldValue: 20000.00,
            newValue: 25000.00,
            reason: 'Ajuste para nova campanha de marketing',
            user: 'João Silva',
            type: 'increase'
        },
        {
            id: 2,
            date: '2024-02-15',
            oldValue: 22000.00,
            newValue: 20000.00,
            reason: 'Redução por restrição orçamentária',
            user: 'Maria Santos',
            type: 'decrease'
        },
        {
            id: 3,
            date: '2024-02-01',
            oldValue: 18000.00,
            newValue: 22000.00,
            reason: 'Aumento para novo projeto',
            user: 'Pedro Costa',
            type: 'increase'
        }
    ];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const getChangeIcon = (type) => {
        if (type === 'increase') {
            return <ArrowUp className="h-4 w-4 text-green-600" />;
        }
        return <ArrowDown className="h-4 w-4 text-red-600" />;
    };

    const getChangeColor = (type) => {
        return type === 'increase' ? 'text-green-600' : 'text-red-600';
    };

    if (!isOpen || !department) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
                    <div>
                        <h3 className="text-lg font-medium">Histórico de Alterações</h3>
                        <p className="text-sm text-gray-500">Departamento: {department.name}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Filtro de Período */}
                    <div className="mb-6">
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="rounded-lg border-gray-300"
                        >
                            <option value="month">Último Mês</option>
                            <option value="quarter">Último Trimestre</option>
                            <option value="semester">Último Semestre</option>
                            <option value="year">Último Ano</option>
                        </select>
                    </div>

                    {/* Timeline de Alterações */}
                    <div className="space-y-6">
                        {history.map((item, index) => (
                            <div key={item.id} className="relative pl-8">
                                {/* Linha vertical conectora */}
                                {index < history.length - 1 && (
                                    <div className="absolute left-3.5 top-8 bottom-0 w-px bg-gray-200"></div>
                                )}

                                {/* Ponto na timeline */}
                                <div className="absolute left-0 top-1.5 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Calendar className="h-4 w-4 text-gray-600" />
                                </div>

                                {/* Conteúdo */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-sm text-gray-500">{formatDate(item.date)}</span>
                                            <p className="font-medium">{item.reason}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getChangeIcon(item.type)}
                                            <span className={`font-medium ${getChangeColor(item.type)}`}>
                                                {formatCurrency(item.newValue - item.oldValue)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Por: {item.user}</span>
                                        <div className="flex items-center gap-4">
                                            <span>De: {formatCurrency(item.oldValue)}</span>
                                            <span>Para: {formatCurrency(item.newValue)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
