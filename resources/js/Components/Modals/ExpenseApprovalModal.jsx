import { useState } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';

export default function ExpenseApprovalModal({ isOpen, onClose, onApprove, onReject, expense }) {
    const [comments, setComments] = useState('');

    const handleApprove = () => {
        onApprove({ id: expense.id, comments });
        setComments('');
    };

    const handleReject = () => {
        onReject({ id: expense.id, comments });
        setComments('');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    if (!isOpen || !expense) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-lg font-medium">Aprovar Despesa</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Detalhes da Despesa */}
                    <div className="space-y-4 mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Descrição
                                </label>
                                <p className="mt-1">{expense.description}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Valor
                                </label>
                                <p className="mt-1 font-medium">{formatCurrency(expense.amount)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Departamento
                                </label>
                                <p className="mt-1">{expense.department}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Data
                                </label>
                                <p className="mt-1">{formatDate(expense.date)}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500">
                                Categoria
                            </label>
                            <p className="mt-1">{expense.category}</p>
                        </div>

                        {expense.notes && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Observações
                                </label>
                                <p className="mt-1">{expense.notes}</p>
                            </div>
                        )}

                        {expense.attachments && expense.attachments.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Anexos
                                </label>
                                <div className="mt-1 space-y-1">
                                    {expense.attachments.map((attachment, index) => (
                                        <div key={index} className="text-blue-600 hover:text-blue-800">
                                            <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                                {attachment.name}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Campo de Comentários */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Comentários
                        </label>
                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border-gray-300"
                            placeholder="Adicione um comentário (opcional)"
                        />
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleReject}
                            className="flex items-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
                        >
                            <XCircle className="h-5 w-5" />
                            Rejeitar
                        </button>
                        <button
                            type="button"
                            onClick={handleApprove}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            <CheckCircle className="h-5 w-5" />
                            Aprovar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
