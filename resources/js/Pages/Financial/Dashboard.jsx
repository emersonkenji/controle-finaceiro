import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    Filter,
    Calendar,
    Users,
    Building2,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import FinancialChart from '@/Components/Charts/FinancialChart';
import { format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

export default function Dashboard({ summary, cashFlow, forecast }) {
    const [period, setPeriod] = useState('month');

    // Dados de exemplo - posteriormente virão do backend
    const metrics = {
        totalExpenses: 82800.00,
        averageApprovalTime: '1.5 dias',
        approvalRate: 85.5,
        pendingCount: 12,
        monthlyTrend: 12.5,
        topDepartments: [
            { name: 'Marketing', amount: 28500.00, percentage: 34.4 },
            { name: 'TI', amount: 19500.00, percentage: 23.6 },
            { name: 'Comercial', amount: 18500.00, percentage: 22.3 },
            { name: 'Administrativo', amount: 16300.00, percentage: 19.7 }
        ]
    };

    const approvalMetrics = {
        approved: 142,
        rejected: 18,
        pending: 12,
        total: 172
    };

    // Dados para o gráfico de aprovações por dia
    const approvalTimelineData = {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        datasets: [
            {
                label: 'Aprovadas',
                data: [12, 15, 8, 10, 14, 5, 3],
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: true
            },
            {
                label: 'Rejeitadas',
                data: [2, 3, 1, 4, 2, 1, 0],
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true
            }
        ]
    };

    // Dados para o gráfico de distribuição por departamento
    const departmentDistributionData = {
        labels: metrics.topDepartments.map(dept => dept.name),
        datasets: [{
            data: metrics.topDepartments.map(dept => dept.amount),
            backgroundColor: [
                'rgb(59, 130, 246)',  // blue
                'rgb(234, 179, 8)',   // yellow
                'rgb(34, 197, 94)',   // green
                'rgb(239, 68, 68)'    // red
            ]
        }]
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

    function formatDate(date) {
        return format(new Date(date), 'MMM/yyyy', { locale: ptBR });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard Financeiro
                    </h2>
                    <div className="flex items-center gap-4">
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="text-sm border-gray-300 rounded-lg"
                        >
                            <option value="week">Esta Semana</option>
                            <option value="month">Este Mês</option>
                            <option value="quarter">Este Trimestre</option>
                            <option value="year">Este Ano</option>
                        </select>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                            <Filter className="w-5 h-5 text-gray-500" />
                            Filtros
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard Financeiro" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* KPIs */}
                    <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
                        <div className="p-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <DollarSign className="w-5 h-5 text-blue-500" />
                                <h3 className="text-sm font-medium text-gray-500">Total em Despesas</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(metrics.totalExpenses)}
                            </p>
                            <div className="flex items-center gap-1 mt-2 text-sm">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-green-600">+{metrics.monthlyTrend}%</span>
                                <span className="text-gray-500">vs. mês anterior</span>
                            </div>
                        </div>

                        <div className="p-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <Clock className="w-5 h-5 text-yellow-500" />
                                <h3 className="text-sm font-medium text-gray-500">Tempo Médio de Aprovação</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {metrics.averageApprovalTime}
                            </p>
                            <p className="mt-2 text-sm text-gray-500">
                                Meta: 1 dia útil
                            </p>
                        </div>

                        <div className="p-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <h3 className="text-sm font-medium text-gray-500">Taxa de Aprovação</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatPercent(metrics.approvalRate)}
                            </p>
                            <div className="flex items-center gap-1 mt-2 text-sm">
                                <span className="text-gray-500">
                                    {approvalMetrics.approved} aprovadas de {approvalMetrics.total}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <Users className="w-5 h-5 text-purple-500" />
                                <h3 className="text-sm font-medium text-gray-500">Despesas Pendentes</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {metrics.pendingCount}
                            </p>
                            <p className="mt-2 text-sm text-gray-500">
                                Aguardando aprovação
                            </p>
                        </div>
                    </div>

                    {/* Gráficos */}
                    <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
                        <div className="p-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Aprovações por Dia</h3>
                                <Calendar className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="h-80">
                                <FinancialChart
                                    type="line"
                                    data={approvalTimelineData}
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
                                                    stepSize: 5
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="p-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Distribuição por Departamento</h3>
                                <Building2 className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="h-80">
                                <FinancialChart
                                    type="pie"
                                    data={departmentDistributionData}
                                    options={{
                                        plugins: {
                                            title: {
                                                display: false
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Top Departamentos */}
                    <div className="p-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <h3 className="mb-6 text-lg font-medium text-gray-900">Top Departamentos</h3>
                        <div className="space-y-4">
                            {metrics.topDepartments.map((dept, index) => (
                                <div key={dept.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-medium text-gray-500">
                                            {index + 1}.
                                        </span>
                                        <div>
                                            <p className="font-medium">{dept.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {formatPercent(dept.percentage)} do total
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-medium">
                                        {formatCurrency(dept.amount)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">
                                    Receitas do Mês
                                </CardTitle>
                                <TrendingUp className="w-4 h-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(summary.current_month_income)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {summary.income_variation > 0 ? '+' : ''}
                                    {summary.income_variation}% em relação ao mês anterior
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">
                                    Despesas do Mês
                                </CardTitle>
                                <TrendingDown className="w-4 h-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(summary.current_month_expenses)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {summary.expenses_variation > 0 ? '+' : ''}
                                    {summary.expenses_variation}% em relação ao mês anterior
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">
                                    Saldo do Mês
                                </CardTitle>
                                <DollarSign className="w-4 h-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(summary.current_month_balance)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {summary.balance_variation > 0 ? '+' : ''}
                                    {summary.balance_variation}% em relação ao mês anterior
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">
                                    Previsão do Mês
                                </CardTitle>
                                <Calendar className="w-4 h-4 text-purple-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(summary.current_month_forecast)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {summary.forecast_variation > 0 ? '+' : ''}
                                    {summary.forecast_variation}% em relação ao mês anterior
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Fluxo de Caixa</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={cashFlow}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="date"
                                                tickFormatter={formatDate}
                                            />
                                            <YAxis tickFormatter={formatCurrency} />
                                            <Tooltip
                                                formatter={formatCurrency}
                                                labelFormatter={formatDate}
                                            />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="income"
                                                name="Receitas"
                                                stroke="#22c55e"
                                                strokeWidth={2}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="expenses"
                                                name="Despesas"
                                                stroke="#ef4444"
                                                strokeWidth={2}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="balance"
                                                name="Saldo"
                                                stroke="#3b82f6"
                                                strokeWidth={2}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Previsão Próximos Meses</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={forecast}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="date"
                                                tickFormatter={formatDate}
                                            />
                                            <YAxis tickFormatter={formatCurrency} />
                                            <Tooltip
                                                formatter={formatCurrency}
                                                labelFormatter={formatDate}
                                            />
                                            <Legend />
                                            <Bar
                                                dataKey="income"
                                                name="Receitas"
                                                fill="#22c55e"
                                            />
                                            <Bar
                                                dataKey="expenses"
                                                name="Despesas"
                                                fill="#ef4444"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Maiores Receitas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {summary.top_incomes.map((income) => (
                                        <div key={income.id} className="flex items-center">
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {income.description}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {income.category}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-green-500">
                                                    {formatCurrency(income.amount)}
                                                </p>
                                                <ArrowUpRight className="w-4 h-4 text-green-500" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Maiores Despesas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {summary.top_expenses.map((expense) => (
                                        <div key={expense.id} className="flex items-center">
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {expense.description}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {expense.category}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-red-500">
                                                    {formatCurrency(expense.amount)}
                                                </p>
                                                <ArrowDownRight className="w-4 h-4 text-red-500" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
