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
    BarChart3,
    Truck,
    AlertTriangle,
    Target
} from 'lucide-react';
import FinancialChart from '@/Components/Charts/FinancialChart';
import DashboardAlerts from '@/Components/DashboardAlerts';
import DeliveryChart from '@/Components/Charts/DeliveryChart';

export default function Dashboard() {
    const [period, setPeriod] = useState('month');

    // Dados de exemplo - posteriormente virão do backend
    const metrics = {
        // Vendas
        totalSales: 156800.00,
        salesGrowth: 8.5,
        averageTicket: 850.00,
        totalOrders: 184,
        dailyOrdersAverage: 12,
        conversionRate: 3.2,

        // Financeiro
        totalRevenue: 168500.00,
        revenueGrowth: 12.5,
        accountsReceivable: 45800.00,
        accountsPayable: 32600.00,
        cashFlow: 35900.00,
        profitMargin: 22.5,

        // Estoque
        totalProducts: 342,
        lowStock: 15,
        stockValue: 285000.00,
        stockTurnover: 4.2,
        topSellers: [
            { name: 'Produto A', quantity: 48, revenue: 24000.00 },
            { name: 'Produto B', quantity: 35, revenue: 19250.00 },
            { name: 'Produto C', quantity: 29, revenue: 15950.00 }
        ],

        // Clientes
        totalCustomers: 256,
        newCustomers: 12,
        customerGrowth: 4.8,
        customerLifetimeValue: 3200.00,
        churnRate: 1.2
    };

    // Dados de alerta para o componente DashboardAlerts
    const alerts = {
        lowStock: [
            { id: 1, name: 'Produto X', stock: 3 },
            { id: 2, name: 'Produto Y', stock: 5 },
            { id: 3, name: 'Produto Z', stock: 2 },
            { id: 4, name: 'Produto W', stock: 4 }
        ],
        pendingOrders: [
            { id: 1, number: '2024001', total: '1.250,00' },
            { id: 2, number: '2024002', total: '850,00' },
            { id: 3, number: '2024003', total: '2.100,00' },
            { id: 4, number: '2024004', total: '750,00' }
        ],
        deliveries: [
            { id: 1, status: 'Em rota de entrega' },
            { id: 2, status: 'Saiu para entrega' },
            { id: 3, status: 'Em separação' },
            { id: 4, status: 'Aguardando coleta' }
        ]
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

    // Dados para o gráfico de entregas
    const deliveryData = {
        labels: ['Em rota', 'Saiu para entrega', 'Em separação', 'Aguardando coleta'],
        datasets: [
            {
                label: 'Quantidade',
                data: [5, 3, 4, 2],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.5)',  // verde
                    'rgba(59, 130, 246, 0.5)', // azul
                    'rgba(234, 179, 8, 0.5)',  // amarelo
                    'rgba(168, 162, 158, 0.5)' // cinza
                ],
                borderColor: [
                    'rgb(34, 197, 94)',
                    'rgb(59, 130, 246)',
                    'rgb(234, 179, 8)',
                    'rgb(168, 162, 158)'
                ],
                borderWidth: 1
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
                        <option value="day">Hoje</option>
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
                    {/* KPIs Principais */}
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
                            <div className="mt-4 text-sm text-gray-500">
                                <div>Ticket Médio: {formatCurrency(metrics.averageTicket)}</div>
                                <div>Pedidos: {metrics.totalOrders}</div>
                            </div>
                        </div>

                        {/* Financeiro */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <DollarSign className="h-5 w-5 text-green-500" />
                                <h3 className="text-sm font-medium text-gray-500">Financeiro</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(metrics.totalRevenue)}
                            </p>
                            <div className="flex items-center gap-1 mt-2 text-sm">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                <span className="text-green-600">+{metrics.revenueGrowth}%</span>
                                <span className="text-gray-500">vs. mês anterior</span>
                            </div>
                            <div className="mt-4 text-sm text-gray-500">
                                <div>Margem: {metrics.profitMargin}%</div>
                                <div>Fluxo: {formatCurrency(metrics.cashFlow)}</div>
                            </div>
                        </div>

                        {/* Estoque */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Package className="h-5 w-5 text-yellow-500" />
                                <h3 className="text-sm font-medium text-gray-500">Estoque</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {metrics.totalProducts}
                            </p>
                            <div className="flex items-center gap-1 mt-2 text-sm">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                <span className="text-red-600">{metrics.lowStock} produtos</span>
                                <span className="text-gray-500">com estoque baixo</span>
                            </div>
                            <div className="mt-4 text-sm text-gray-500">
                                <div>Valor: {formatCurrency(metrics.stockValue)}</div>
                                <div>Giro: {metrics.stockTurnover}x</div>
                            </div>
                        </div>

                        {/* Clientes */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Users className="h-5 w-5 text-purple-500" />
                                <h3 className="text-sm font-medium text-gray-500">Clientes</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {metrics.totalCustomers}
                            </p>
                            <div className="flex items-center gap-1 mt-2 text-sm">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                <span className="text-green-600">+{metrics.customerGrowth}%</span>
                                <span className="text-gray-500">{metrics.newCustomers} novos</span>
                            </div>
                            <div className="mt-4 text-sm text-gray-500">
                                <div>LTV: {formatCurrency(metrics.customerLifetimeValue)}</div>
                                <div>Churn: {metrics.churnRate}%</div>
                            </div>
                        </div>
                    </div>

                    {/* Alertas do Sistema */}
                    <div className="mb-6">
                        <DashboardAlerts alerts={alerts} />
                    </div>

                    {/* Gráficos */}
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

                    {/* Gráfico de Entregas e Produtos Mais Vendidos */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Gráfico de Entregas */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Status das Entregas</h3>
                                <Truck className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="h-80">
                                <DeliveryChart data={deliveryData} />
                            </div>
                        </div>

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
                                                <p className="font-medium text-gray-900">{product.name}</p>
                                                <p className="text-sm text-gray-500">{product.quantity} unidades</p>
                                            </div>
                                        </div>
                                        <span className="font-medium text-gray-900">
                                            {formatCurrency(product.revenue)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
