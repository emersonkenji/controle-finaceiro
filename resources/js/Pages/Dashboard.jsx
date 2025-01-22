import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Package,
    Users,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3
} from 'lucide-react';
import FinancialChart from '@/Components/Charts/FinancialChart';
import GoalsAndAlerts from '@/Components/GoalsAndAlerts';

export default function Dashboard() {
    const [period, setPeriod] = useState('month');

    // Dados de exemplo - posteriormente virão do backend
    const metrics = {
        // Vendas
        totalSales: 156800.00,
        salesGrowth: 8.5,
        averageTicket: 850.00,
        totalOrders: 184,

        // Financeiro
        totalRevenue: 168500.00,
        revenueGrowth: 12.5,
        accountsReceivable: 45800.00,
        accountsPayable: 32600.00,

        // Estoque
        totalProducts: 342,
        lowStock: 15,
        topSellers: [
            { name: 'Produto A', quantity: 48, revenue: 24000.00 },
            { name: 'Produto B', quantity: 35, revenue: 19250.00 },
            { name: 'Produto C', quantity: 29, revenue: 15950.00 }
        ],

        // Clientes
        totalCustomers: 256,
        newCustomers: 12,
        customerGrowth: 4.8
    };

    // Dados para o gráfico de vendas vs receita
    const performanceData = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [
            {
                label: 'Vendas',
                data: [125000, 138000, 142000, 148000, 152000, 156800],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true
            },
            {
                label: 'Receita',
                data: [132000, 145000, 150000, 156000, 162000, 168500],
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: true
            }
        ]
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatPercent = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(value / 100);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard
                    </h2>
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
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {/* Vendas */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <ShoppingCart className="h-5 w-5 text-blue-500" />
                                <h3 className="text-sm font-medium text-gray-500">Total em Vendas</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(metrics.totalSales)}
                            </p>
                            <div className="flex items-center gap-1 mt-2 text-sm">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                <span className="text-green-600">+{metrics.salesGrowth}%</span>
                                <span className="text-gray-500">vs. mês anterior</span>
                            </div>
                        </div>

                        {/* Receita */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <DollarSign className="h-5 w-5 text-green-500" />
                                <h3 className="text-sm font-medium text-gray-500">Receita Total</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(metrics.totalRevenue)}
                            </p>
                            <div className="flex items-center gap-1 mt-2 text-sm">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                <span className="text-green-600">+{metrics.revenueGrowth}%</span>
                                <span className="text-gray-500">vs. mês anterior</span>
                            </div>
                        </div>

                        {/* Produtos */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Package className="h-5 w-5 text-yellow-500" />
                                <h3 className="text-sm font-medium text-gray-500">Total de Produtos</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {metrics.totalProducts}
                            </p>
                            <p className="text-sm text-red-500 mt-2">
                                {metrics.lowStock} produtos com estoque baixo
                            </p>
                        </div>

                        {/* Clientes */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Users className="h-5 w-5 text-purple-500" />
                                <h3 className="text-sm font-medium text-gray-500">Total de Clientes</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {metrics.totalCustomers}
                            </p>
                            <div className="flex items-center gap-1 mt-2 text-sm">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                <span className="text-green-600">+{metrics.customerGrowth}%</span>
                                <span className="text-gray-500">{metrics.newCustomers} novos</span>
                            </div>
                        </div>
                    </div>

                    {/* Gráfico e Contas */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Gráfico de Performance */}
                        <div className="lg:col-span-2 bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Performance</h3>
                                <BarChart3 className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="h-80">
                                <FinancialChart
                                    type="line"
                                    data={performanceData}
                                    options={{
                                        plugins: {
                                            title: {
                                                display: false
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: {
                                                    callback: (value) => formatCurrency(value)
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Contas */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Contas</h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-gray-500">A Receber</span>
                                        <div className="flex items-center gap-1 text-green-600">
                                            <ArrowUpRight className="h-4 w-4" />
                                            {formatCurrency(metrics.accountsReceivable)}
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-gray-500">A Pagar</span>
                                        <div className="flex items-center gap-1 text-red-600">
                                            <ArrowDownRight className="h-4 w-4" />
                                            {formatCurrency(metrics.accountsPayable)}
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Produtos Mais Vendidos e Metas */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Produtos Mais Vendidos */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Produtos Mais Vendidos</h3>
                            <div className="space-y-4">
                                {metrics.topSellers.map((product, index) => (
                                    <div key={product.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-medium text-gray-500">
                                                {index + 1}.
                                            </span>
                                            <div>
                                                <p className="font-medium">{product.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {product.quantity} unidades vendidas
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-medium">
                                            {formatCurrency(product.revenue)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Metas e Alertas */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <GoalsAndAlerts />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
