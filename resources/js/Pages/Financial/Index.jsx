import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowUpCircle,
    ArrowDownCircle,
    DollarSign,
    TrendingUp,
    Calendar,
    Filter,
    CreditCard,
    Wallet,
    PieChart,
    BarChart3
} from 'lucide-react';

export default function FinancialIndex() {
    const [period, setPeriod] = useState('month');

    // Dados de exemplo - posteriormente virão do backend
    const summary = {
        income: 45678.90,
        expenses: 23456.78,
        profit: 22222.12,
        pendingReceivables: 12345.67,
        pendingPayables: 8765.43,
        cashBalance: 33987.56
    };

    const recentTransactions = [
        {
            id: 1,
            type: 'income',
            description: 'Venda #1234',
            amount: 1299.99,
            date: '2024-02-20',
            category: 'Vendas',
            status: 'completed'
        },
        {
            id: 2,
            type: 'expense',
            description: 'Fornecedor XYZ',
            amount: 567.89,
            date: '2024-02-19',
            category: 'Fornecedores',
            status: 'completed'
        }
    ];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Financeiro
                    </h2>
                    <div className="flex items-center gap-4">
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="rounded-lg border-gray-300 text-sm"
                        >
                            <option value="day">Hoje</option>
                            <option value="week">Esta Semana</option>
                            <option value="month">Este Mês</option>
                            <option value="year">Este Ano</option>
                        </select>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                            <Filter className="h-5 w-5 text-gray-500" />
                            Filtros
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Financeiro" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Cards de Resumo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <ArrowUpCircle className="h-8 w-8 text-green-500" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Receitas</h3>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(summary.income)}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm text-green-600">+12%</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Meta: {formatCurrency(50000)}</span>
                                <span>91.3%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                                <div className="h-2 bg-green-500 rounded-full" style={{ width: '91.3%' }}></div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <ArrowDownCircle className="h-8 w-8 text-red-500" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Despesas</h3>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(summary.expenses)}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm text-red-600">-5%</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Limite: {formatCurrency(30000)}</span>
                                <span>78.2%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                                <div className="h-2 bg-red-500 rounded-full" style={{ width: '78.2%' }}></div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="h-8 w-8 text-blue-500" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Lucro</h3>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(summary.profit)}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm text-blue-600">+8%</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Meta: {formatCurrency(20000)}</span>
                                <span>111.1%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                                <div className="h-2 bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Contas a Pagar/Receber e Saldo */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Contas a Receber</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Hoje</p>
                                            <p className="text-sm text-gray-500">3 títulos</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {formatCurrency(2345.67)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Próximos 7 dias</p>
                                            <p className="text-sm text-gray-500">8 títulos</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {formatCurrency(5678.90)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Contas a Pagar</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Hoje</p>
                                            <p className="text-sm text-gray-500">2 títulos</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {formatCurrency(1234.56)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Próximos 7 dias</p>
                                            <p className="text-sm text-gray-500">5 títulos</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {formatCurrency(4567.89)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Saldo em Contas</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="h-5 w-5 text-blue-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Conta Principal</p>
                                            <p className="text-sm text-gray-500">Banco XYZ</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {formatCurrency(23456.78)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Wallet className="h-5 w-5 text-green-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Caixa</p>
                                            <p className="text-sm text-gray-500">Dinheiro em espécie</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {formatCurrency(1234.56)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gráficos */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Receitas vs Despesas</h3>
                                <BarChart3 className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                                <span className="text-sm text-gray-500">Gráfico será implementado aqui</span>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Despesas por Categoria</h3>
                                <PieChart className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                                <span className="text-sm text-gray-500">Gráfico será implementado aqui</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
