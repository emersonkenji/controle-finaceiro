import { useState } from 'react';
import { X, CreditCard, Banknote, Wallet } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, total, onConfirm }) {
    const [paymentMethod, setPaymentMethod] = useState('credit');
    const [installments, setInstallments] = useState(1);
    const [receivedAmount, setReceivedAmount] = useState('');

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const calculateChange = () => {
        const received = parseFloat(receivedAmount.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
        return received - total;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                            Finalizar Venda
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <div className="text-sm text-gray-600 mb-2">Total da Venda</div>
                        <div className="text-3xl font-bold text-green-600">
                            {formatCurrency(total)}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Forma de Pagamento
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => setPaymentMethod('credit')}
                                className={`flex flex-col items-center justify-center p-3 border rounded-lg ${
                                    paymentMethod === 'credit'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                <CreditCard className={`h-6 w-6 ${
                                    paymentMethod === 'credit' ? 'text-blue-600' : 'text-gray-400'
                                }`} />
                                <span className="text-xs mt-1">Cartão</span>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('cash')}
                                className={`flex flex-col items-center justify-center p-3 border rounded-lg ${
                                    paymentMethod === 'cash'
                                        ? 'border-green-500 bg-green-50'
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                <Banknote className={`h-6 w-6 ${
                                    paymentMethod === 'cash' ? 'text-green-600' : 'text-gray-400'
                                }`} />
                                <span className="text-xs mt-1">Dinheiro</span>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('pix')}
                                className={`flex flex-col items-center justify-center p-3 border rounded-lg ${
                                    paymentMethod === 'pix'
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                <Wallet className={`h-6 w-6 ${
                                    paymentMethod === 'pix' ? 'text-purple-600' : 'text-gray-400'
                                }`} />
                                <span className="text-xs mt-1">Pix</span>
                            </button>
                        </div>
                    </div>

                    {paymentMethod === 'credit' && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Parcelas
                            </label>
                            <select
                                value={installments}
                                onChange={(e) => setInstallments(parseInt(e.target.value))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                                    <option key={n} value={n}>
                                        {n}x de {formatCurrency(total / n)}
                                        {n === 1 ? ' à vista' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {paymentMethod === 'cash' && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Valor Recebido
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">R$</span>
                                </div>
                                <input
                                    type="text"
                                    value={receivedAmount}
                                    onChange={(e) => setReceivedAmount(e.target.value)}
                                    className="pl-8 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            {receivedAmount && (
                                <div className="mt-2">
                                    <span className="text-sm text-gray-600">
                                        Troco: {formatCurrency(calculateChange())}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => onConfirm({
                                method: paymentMethod,
                                installments: paymentMethod === 'credit' ? installments : 1,
                                receivedAmount: receivedAmount ? parseFloat(receivedAmount) : total,
                                change: paymentMethod === 'cash' ? calculateChange() : 0
                            })}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                            Confirmar Pagamento
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
