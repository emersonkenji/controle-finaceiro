import { useState } from 'react';
import {
    CreditCard,
    DollarSign,
    Percent,
    Calendar,
    AlertTriangle,
    Check,
    X
} from 'lucide-react';

export default function FinancialSettings() {
    const [settings, setSettings] = useState({
        payment: {
            acceptCreditCard: true,
            acceptDebitCard: true,
            acceptPix: true,
            acceptBankSlip: true,
            acceptCash: true,
            maxInstallments: 12,
            minInstallmentValue: 50,
            interestRate: 2.5
        },
        billing: {
            gracePeriod: 5,
            lateFeePercentage: 2,
            dailyInterestRate: 0.033,
            automaticReminders: true,
            reminderDays: [3, 1, 0],
            blockOverdueClients: true
        },
        taxes: {
            defaultTaxRate: 18,
            useDefaultTax: true,
            separateTaxInvoice: true,
            automaticTaxCalculation: true
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
            {/* Configurações de Pagamento */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">
                        Configurações de Pagamento
                    </h3>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.payment.acceptCreditCard}
                                onChange={(e) => handleChange('payment', 'acceptCreditCard', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Aceitar Cartão de Crédito
                            </span>
                        </label>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.payment.acceptDebitCard}
                                onChange={(e) => handleChange('payment', 'acceptDebitCard', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Aceitar Cartão de Débito
                            </span>
                        </label>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.payment.acceptPix}
                                onChange={(e) => handleChange('payment', 'acceptPix', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Aceitar PIX
                            </span>
                        </label>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.payment.acceptBankSlip}
                                onChange={(e) => handleChange('payment', 'acceptBankSlip', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Aceitar Boleto
                            </span>
                        </label>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.payment.acceptCash}
                                onChange={(e) => handleChange('payment', 'acceptCash', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Aceitar Dinheiro
                            </span>
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Máximo de Parcelas
                            </label>
                            <input
                                type="number"
                                value={settings.payment.maxInstallments}
                                onChange={(e) => handleChange('payment', 'maxInstallments', parseInt(e.target.value))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Valor Mínimo da Parcela
                            </label>
                            <input
                                type="number"
                                value={settings.payment.minInstallmentValue}
                                onChange={(e) => handleChange('payment', 'minInstallmentValue', parseFloat(e.target.value))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Taxa de Juros (%)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={settings.payment.interestRate}
                                onChange={(e) => handleChange('payment', 'interestRate', parseFloat(e.target.value))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Configurações de Cobrança */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">
                        Configurações de Cobrança
                    </h3>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Período de Carência (dias)
                            </label>
                            <input
                                type="number"
                                value={settings.billing.gracePeriod}
                                onChange={(e) => handleChange('billing', 'gracePeriod', parseInt(e.target.value))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Multa por Atraso (%)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={settings.billing.lateFeePercentage}
                                onChange={(e) => handleChange('billing', 'lateFeePercentage', parseFloat(e.target.value))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Juros Diários (%)
                            </label>
                            <input
                                type="number"
                                step="0.001"
                                value={settings.billing.dailyInterestRate}
                                onChange={(e) => handleChange('billing', 'dailyInterestRate', parseFloat(e.target.value))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.billing.automaticReminders}
                                onChange={(e) => handleChange('billing', 'automaticReminders', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Lembretes Automáticos
                            </span>
                        </label>
                    </div>

                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.billing.blockOverdueClients}
                                onChange={(e) => handleChange('billing', 'blockOverdueClients', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Bloquear Clientes em Atraso
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Configurações de Impostos */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Percent className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">
                        Configurações de Impostos
                    </h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Taxa Padrão de Imposto (%)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={settings.taxes.defaultTaxRate}
                            onChange={(e) => handleChange('taxes', 'defaultTaxRate', parseFloat(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.taxes.useDefaultTax}
                                onChange={(e) => handleChange('taxes', 'useDefaultTax', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Usar Taxa Padrão
                            </span>
                        </label>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.taxes.separateTaxInvoice}
                                onChange={(e) => handleChange('taxes', 'separateTaxInvoice', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Separar Impostos na Nota
                            </span>
                        </label>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.taxes.automaticTaxCalculation}
                                onChange={(e) => handleChange('taxes', 'automaticTaxCalculation', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Cálculo Automático de Impostos
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
                                Tem certeza que deseja redefinir todas as configurações financeiras para os valores padrão? Esta ação não pode ser desfeita.
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
