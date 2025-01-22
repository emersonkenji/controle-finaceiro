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
    Building2
} from 'lucide-react';
import FinancialChart from '@/Components/Charts/FinancialChart';

export default function Dashboard() {
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

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard Financeiro
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
                    </div>
                </div>
            }
        >
            <Head title="Dashboard Financeiro" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <DollarSign className="h-5 w-5 text-blue-500" />
                                <h3 className="text-sm font-medium text-gray-500">Total em Despesas</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(metrics.totalExpenses)}
                            </p>
                            <div className="flex items-center gap-1 mt-2 text-sm">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                <span className="text-green-600">+{metrics.monthlyTrend}%</span>
                                <span className="text-gray-500">vs. mês anterior</span>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Clock className="h-5 w-5 text-yellow-500" />
                                <h3 className="text-sm font-medium text-gray-500">Tempo Médio de Aprovação</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {metrics.averageApprovalTime}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Meta: 1 dia útil
                            </p>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
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

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Users className="h-5 w-5 text-purple-500" />
                                <h3 className="text-sm font-medium text-gray-500">Despesas Pendentes</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {metrics.pendingCount}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Aguardando aprovação
                            </p>
                        </div>
                    </div>

                    {/* Gráficos */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Aprovações por Dia</h3>
                                <Calendar className="h-5 w-5 text-gray-400" />
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

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Distribuição por Departamento</h3>
                                <Building2 className="h-5 w-5 text-gray-400" />
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
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-6">Top Departamentos</h3>
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
