import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function BudgetFormModal({ isOpen, onClose, onSubmit, departments }) {
    const [budgets, setBudgets] = useState([]);

    useEffect(() => {
        if (departments) {
            setBudgets(departments.map(dept => ({
                id: dept.id,
                name: dept.name,
                budget: dept.budget
            })));
        }
    }, [departments]);

    const handleChange = (id, value) => {
        setBudgets(prev => prev.map(budget =>
            budget.id === id ? { ...budget, budget: parseFloat(value) || 0 } : budget
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(budgets);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    if (!isOpen) return null;

    const totalBudget = budgets.reduce((acc, curr) => acc + (curr.budget || 0), 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-lg font-medium">Gerenciar Orçamentos</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        {budgets.map(budget => (
                            <div key={budget.id} className="border-b pb-4 last:border-0">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {budget.name}
                                    </label>
                                    <input
                                        type="number"
                                        value={budget.budget || ''}
                                        onChange={(e) => handleChange(budget.id, e.target.value)}
                                        className="w-48 rounded-lg border-gray-300"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="pt-4 border-t">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Orçamento Total</span>
                                <span className="text-lg font-bold">
                                    {formatCurrency(totalBudget)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
