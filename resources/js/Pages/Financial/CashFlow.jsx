import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowUpCircle,
    ArrowDownCircle,
    TrendingUp,
    Calendar,
    Filter,
    Download,
    BarChart3,
    LineChart,
    PieChart
} from 'lucide-react';

export default function CashFlowIndex() {
    const [period, setPeriod] = useState('month');

    // Dados de exemplo - posteriormente virão do backend
    const summary = {
        inflow: 45678.90,
        outflow: 23456.78,
        balance: 22222.12,
        projectedInflow: 15000.00,
        projectedOutflow: 12000.00,
        projectedBalance: 3000.00
    };

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
                        Fluxo de Caixa
                    </h2>
                    <div className="flex items-center gap-4">
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="rounded-lg border-gray-300 text-sm"
                        >
                            <option value="week">Esta Semana</option>
                            <option value="month">Este Mês</option>
                            <option value="quarter">Este Trimestre</option>
                            <option value="year">Este Ano</option>
                        </select>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                            <Filter className="h-5 w-5 text-gray-500" />
                            Filtros
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                            <Download className="h-5 w-5 text-gray-500" />
                            Exportar
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Fluxo de Caixa" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Cards de Resumo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <ArrowUpCircle className="h-8 w-8 text-green-500" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Entradas</h3>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(summary.inflow)}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm text-green-600">+12%</span>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                Projeção: {formatCurrency(summary.projectedInflow)}
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <ArrowDownCircle className="h-8 w-8 text-red-500" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Saídas</h3>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(summary.outflow)}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm text-red-600">-5%</span>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                Projeção: {formatCurrency(summary.projectedOutflow)}
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="h-8 w-8 text-blue-500" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Saldo</h3>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(summary.balance)}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm text-blue-600">+8%</span>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                Projeção: {formatCurrency(summary.projectedBalance)}
                            </div>
                        </div>
                    </div>

                    {/* Gráficos */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Fluxo de Caixa</h3>
                                <LineChart className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                                <span className="text-sm text-gray-500">Gráfico de linha será implementado aqui</span>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Entradas vs Saídas</h3>
                                <BarChart3 className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                                <span className="text-sm text-gray-500">Gráfico de barras será implementado aqui</span>
                            </div>
                        </div>
                    </div>

                    {/* Análises */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Categorias de Entrada</h3>
                                <PieChart className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                                <span className="text-sm text-gray-500">Gráfico de pizza será implementado aqui</span>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Categorias de Saída</h3>
                                <PieChart className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                                <span className="text-sm text-gray-500">Gráfico de pizza será implementado aqui</span>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Projeção Mensal</h3>
                                <LineChart className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                                <span className="text-sm text-gray-500">Gráfico de linha será implementado aqui</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
