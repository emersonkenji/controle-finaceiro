import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    Download,
    Filter,
    Plus,
    Search,
    Building2,
    DollarSign,
    PieChart,
    BarChart3,
    TrendingUp,
    MoreHorizontal,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Clock,
    FileText,
    History
} from 'lucide-react';
import FinancialChart from '@/Components/Charts/FinancialChart';
import ExpenseFormModal from '@/Components/Modals/ExpenseFormModal';
import BudgetFormModal from '@/Components/Modals/BudgetFormModal';
import ExpenseApprovalModal from '@/Components/Modals/ExpenseApprovalModal';
import ExportDataModal from '@/Components/Modals/ExportDataModal';
import CustomReportModal from '@/Components/Modals/CustomReportModal';
import BudgetHistoryModal from '@/Components/Modals/BudgetHistoryModal';

export default function CostCenterIndex() {
    const [searchTerm, setSearchTerm] = useState('');
    const [period, setPeriod] = useState('month');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedDepartmentForHistory, setSelectedDepartmentForHistory] = useState(null);

    // Dados de exemplo - posteriormente virão do backend
    const departments = [
        { id: 1, name: 'Comercial', budget: 25000.00, spent: 18500.00 },
        { id: 2, name: 'Marketing', budget: 15000.00, spent: 12800.00 },
        { id: 3, name: 'Administrativo', budget: 35000.00, spent: 32000.00 },
        { id: 4, name: 'TI', budget: 20000.00, spent: 19500.00 }
    ];

    const expenses = [
        {
            id: 1,
            date: '2024-02-20',
            description: 'Material de Escritório',
            department: 'Administrativo',
            category: 'Materiais',
            amount: 1500.00,
            status: 'approved'
        },
        {
            id: 2,
            date: '2024-02-19',
            description: 'Campanha Marketing Digital',
            department: 'Marketing',
            category: 'Publicidade',
            amount: 3500.00,
            status: 'pending'
        },
        {
            id: 3,
            date: '2024-02-18',
            description: 'Licenças de Software',
            department: 'TI',
            category: 'Software',
            amount: 2800.00,
            status: 'approved'
        }
    ];

    const summary = {
        totalBudget: 95000.00,
        totalSpent: 82800.00,
        totalAvailable: 12200.00,
        percentageUsed: 87.16
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

    const formatPercent = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(value / 100);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getBudgetStatus = (spent, budget) => {
        const percentage = (spent / budget) * 100;
        if (percentage >= 90) return 'text-red-600';
        if (percentage >= 70) return 'text-yellow-600';
        return 'text-green-600';
    };

    // Dados para o gráfico de pizza
    const pieChartData = {
        labels: departments.map(dept => dept.name),
        datasets: [{
            data: departments.map(dept => dept.spent),
            backgroundColor: [
                'rgb(59, 130, 246)', // blue-600
                'rgb(234, 179, 8)',  // yellow-500
                'rgb(34, 197, 94)',  // green-500
                'rgb(239, 68, 68)',  // red-500
            ],
            borderWidth: 1
        }]
    };

    // Dados para o gráfico de evolução mensal
    const monthlyData = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [
            {
                label: 'Orçado',
                data: [85000, 88000, 90000, 92000, 95000, 98000],
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 2,
                tension: 0.4,
                useGradient: true
            },
            {
                label: 'Realizado',
                data: [82000, 85000, 87000, 89000, 82800, 0],
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 2,
                tension: 0.4,
                useGradient: true
            }
        ]
    };

    // Opções específicas para o gráfico de pizza
    const pieChartOptions = {
        plugins: {
            title: {
                display: true,
                text: 'Distribuição de Gastos por Departamento',
                padding: {
                    top: 10,
                    bottom: 30
                }
            }
        }
    };

    // Opções específicas para o gráfico de linha
    const lineChartOptions = {
        plugins: {
            title: {
                display: true,
                text: 'Evolução do Orçamento vs Realizado',
                padding: {
                    top: 10,
                    bottom: 30
                }
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
    };

    const handleExpenseSubmit = (formData) => {
        // Aqui você implementará a lógica para salvar a despesa
        console.log('Nova despesa:', formData);
        setShowExpenseModal(false);
    };

    const handleBudgetSubmit = (updatedBudgets) => {
        // Aqui você implementará a lógica para salvar os orçamentos
        console.log('Orçamentos atualizados:', updatedBudgets);
        setShowBudgetModal(false);
    };

    const handleApprove = (data) => {
        console.log('Despesa aprovada:', data);
        setShowApprovalModal(false);
        setSelectedExpense(null);
    };

    const handleReject = (data) => {
        console.log('Despesa rejeitada:', data);
        setShowApprovalModal(false);
        setSelectedExpense(null);
    };

    const openApprovalModal = (expense) => {
        setSelectedExpense(expense);
        setShowApprovalModal(true);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'rejected':
                return <XCircle className="h-5 w-5 text-red-600" />;
            case 'pending':
                return <Clock className="h-5 w-5 text-yellow-600" />;
            default:
                return null;
        }
    };

    const handleExport = (exportConfig) => {
        // Aqui você implementará a lógica para exportar os dados
        console.log('Configurações de exportação:', exportConfig);
        setShowExportModal(false);
    };

    const handleGenerateReport = (reportConfig) => {
        // Aqui você implementará a lógica para gerar o relatório personalizado
        console.log('Configuração do relatório:', reportConfig);
        setShowReportModal(false);
    };

    const openHistoryModal = (department) => {
        setSelectedDepartmentForHistory(department);
        setShowHistoryModal(true);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Centro de Custos
                    </h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowReportModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
                        >
                            <FileText className="h-5 w-5 text-gray-500" />
                            Relatórios
                        </button>
                        <button
                            onClick={() => setShowExportModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
                        >
                            <Download className="h-5 w-5 text-gray-500" />
                            Exportar
                        </button>
                        <button
                            onClick={() => setShowExpenseModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <Plus className="h-5 w-5" />
                            Nova Despesa
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Centro de Custos" />

            {/* Modais */}
            <ExpenseFormModal
                isOpen={showExpenseModal}
                onClose={() => setShowExpenseModal(false)}
                onSubmit={handleExpenseSubmit}
            />

            <BudgetFormModal
                isOpen={showBudgetModal}
                onClose={() => setShowBudgetModal(false)}
                onSubmit={handleBudgetSubmit}
                departments={departments}
            />

            <ExpenseApprovalModal
                isOpen={showApprovalModal}
                onClose={() => {
                    setShowApprovalModal(false);
                    setSelectedExpense(null);
                }}
                onApprove={handleApprove}
                onReject={handleReject}
                expense={selectedExpense}
            />

            <ExportDataModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                onExport={handleExport}
            />

            <CustomReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                onGenerate={handleGenerateReport}
            />

            <BudgetHistoryModal
                isOpen={showHistoryModal}
                onClose={() => {
                    setShowHistoryModal(false);
                    setSelectedDepartmentForHistory(null);
                }}
                department={selectedDepartmentForHistory}
            />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Filtros */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Departamento
                                </label>
                                <select
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                    className="w-full rounded-lg border-gray-300"
                                >
                                    <option value="all">Todos os Departamentos</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="sm:w-48">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Período
                                </label>
                                <select
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                    className="w-full rounded-lg border-gray-300"
                                >
                                    <option value="month">Este Mês</option>
                                    <option value="quarter">Este Trimestre</option>
                                    <option value="year">Este Ano</option>
                                    <option value="custom">Personalizado</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Cards de Resumo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <DollarSign className="h-5 w-5 text-gray-400" />
                                <h3 className="text-sm font-medium text-gray-500">Orçamento Total</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(summary.totalBudget)}
                            </p>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp className="h-5 w-5 text-gray-400" />
                                <h3 className="text-sm font-medium text-gray-500">Total Utilizado</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(summary.totalSpent)}
                            </p>
                            <p className="mt-2 text-sm text-gray-500">
                                {formatPercent(summary.percentageUsed)} do orçamento
                            </p>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <DollarSign className="h-5 w-5 text-gray-400" />
                                <h3 className="text-sm font-medium text-gray-500">Saldo Disponível</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(summary.totalAvailable)}
                            </p>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Building2 className="h-5 w-5 text-gray-400" />
                                <h3 className="text-sm font-medium text-gray-500">Departamentos</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {departments.length}
                            </p>
                        </div>
                    </div>

                    {/* Orçamento por Departamento e Gráfico */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Orçamento por Departamento</h3>
                                <button
                                    onClick={() => setShowBudgetModal(true)}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    Gerenciar Orçamentos
                                </button>
                            </div>
                            <div className="space-y-4">
                                {departments.map(dept => (
                                    <div key={dept.id} className="border-b pb-4 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{dept.name}</span>
                                                <button
                                                    onClick={() => openHistoryModal(dept)}
                                                    className="p-1 text-gray-400 hover:text-gray-600"
                                                    title="Ver histórico"
                                                >
                                                    <History className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-sm ${getBudgetStatus(dept.spent, dept.budget)}`}>
                                                    {formatCurrency(dept.spent)}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    / {formatCurrency(dept.budget)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full">
                                            <div
                                                className={`h-2 rounded-full ${
                                                    (dept.spent / dept.budget) * 100 >= 90 ? 'bg-red-500' :
                                                    (dept.spent / dept.budget) * 100 >= 70 ? 'bg-yellow-500' :
                                                    'bg-green-500'
                                                }`}
                                                style={{ width: `${Math.min((dept.spent / dept.budget) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Distribuição de Gastos</h3>
                                <PieChart className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="h-80">
                                <FinancialChart
                                    type="pie"
                                    data={pieChartData}
                                    options={pieChartOptions}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Gráfico de Evolução */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
                        <div className="h-80">
                            <FinancialChart
                                type="line"
                                data={monthlyData}
                                options={lineChartOptions}
                            />
                        </div>
                    </div>

                    {/* Lista de Despesas */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Filtros e Busca */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar por descrição..."
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                                    <Filter className="h-5 w-5" />
                                    Mais Filtros
                                </button>
                            </div>
                        </div>

                        {/* Tabela */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Data
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Descrição
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Departamento
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Categoria
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Valor
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {expenses.map(expense => (
                                        <tr key={expense.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(expense.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {expense.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {expense.department}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {expense.category}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(expense.amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {getStatusIcon(expense.status)}
                                                    <span className={`ml-2 text-sm ${getStatusColor(expense.status)}`}>
                                                        {expense.status === 'approved' ? 'Aprovado' :
                                                         expense.status === 'rejected' ? 'Rejeitado' :
                                                         'Pendente'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-3">
                                                    {expense.status === 'pending' && (
                                                        <button
                                                            onClick={() => openApprovalModal(expense)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Aprovar
                                                        </button>
                                                    )}
                                                    <button className="text-gray-600 hover:text-gray-900">
                                                        <MoreHorizontal className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginação */}
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Mostrando 1-10 de 50 resultados
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 border rounded hover:bg-gray-50">
                                        Anterior
                                    </button>
                                    <button className="px-3 py-1 border rounded bg-blue-50 text-blue-600 font-medium">
                                        1
                                    </button>
                                    <button className="px-3 py-1 border rounded hover:bg-gray-50">
                                        2
                                    </button>
                                    <button className="px-3 py-1 border rounded hover:bg-gray-50">
                                        3
                                    </button>
                                    <button className="px-3 py-1 border rounded hover:bg-gray-50">
                                        Próximo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
