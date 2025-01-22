import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    Download,
    Filter,
    Calendar,
    CreditCard,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Plus,
    Search,
    Upload,
    RefreshCw
} from 'lucide-react';

export default function BankReconciliationIndex() {
    const [period, setPeriod] = useState('month');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAccount, setSelectedAccount] = useState('all');

    // Dados de exemplo - posteriormente virão do backend
    const accounts = [
        { id: 1, name: 'Conta Principal', bank: 'Banco XYZ', number: '1234-5', balance: 45678.90 },
        { id: 2, name: 'Conta Secundária', bank: 'Banco ABC', number: '6789-0', balance: 12345.67 }
    ];

    const transactions = [
        {
            id: 1,
            date: '2024-02-20',
            description: 'Pagamento Cliente ABC',
            type: 'credit',
            amount: 1500.00,
            status: 'reconciled',
            bankDate: '2024-02-20',
            bankAmount: 1500.00,
            difference: 0
        },
        {
            id: 2,
            date: '2024-02-19',
            description: 'Fornecedor XYZ',
            type: 'debit',
            amount: -2500.00,
            status: 'pending',
            bankDate: '2024-02-19',
            bankAmount: -2500.00,
            difference: 0
        },
        {
            id: 3,
            date: '2024-02-18',
            description: 'Venda #1234',
            type: 'credit',
            amount: 750.00,
            status: 'divergent',
            bankDate: '2024-02-18',
            bankAmount: 725.00,
            difference: 25.00
        }
    ];

    const summary = {
        totalReconciled: 15000.00,
        totalPending: 5000.00,
        totalDivergent: 2500.00,
        accountBalance: 45678.90,
        systemBalance: 43178.90,
        difference: 2500.00
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'reconciled':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'divergent':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'reconciled':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'pending':
                return <AlertCircle className="h-4 w-4 text-yellow-500" />;
            case 'divergent':
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return null;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Conciliação Bancária
                    </h2>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                            <Upload className="h-5 w-5 text-gray-500" />
                            Importar OFX
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                            <Download className="h-5 w-5 text-gray-500" />
                            Exportar
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <Plus className="h-5 w-5" />
                            Novo Lançamento
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Conciliação Bancária" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Seleção de Conta e Período */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Conta Bancária
                                </label>
                                <select
                                    value={selectedAccount}
                                    onChange={(e) => setSelectedAccount(e.target.value)}
                                    className="w-full rounded-lg border-gray-300"
                                >
                                    <option value="all">Todas as Contas</option>
                                    {accounts.map(account => (
                                        <option key={account.id} value={account.id}>
                                            {account.name} - {account.bank} ({account.number})
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
                                    <option value="week">Esta Semana</option>
                                    <option value="month">Este Mês</option>
                                    <option value="custom">Personalizado</option>
                                </select>
                            </div>
                            <div className="sm:w-48 flex items-end">
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                                    <RefreshCw className="h-5 w-5 text-gray-500" />
                                    Atualizar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Cards de Resumo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <CreditCard className="h-8 w-8 text-blue-500" />
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Saldo Bancário</h3>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(summary.accountBalance)}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Saldo Sistema</span>
                                    <span className="font-medium">{formatCurrency(summary.systemBalance)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Diferença</span>
                                    <span className="font-medium text-red-600">{formatCurrency(summary.difference)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-sm font-medium text-gray-500 mb-4">Status dos Lançamentos</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        <span className="text-sm text-gray-700">Conciliados</span>
                                    </div>
                                    <span className="font-medium">{formatCurrency(summary.totalReconciled)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                                        <span className="text-sm text-gray-700">Pendentes</span>
                                    </div>
                                    <span className="font-medium">{formatCurrency(summary.totalPending)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="h-5 w-5 text-red-500" />
                                        <span className="text-sm text-gray-700">Divergentes</span>
                                    </div>
                                    <span className="font-medium">{formatCurrency(summary.totalDivergent)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-sm font-medium text-gray-500 mb-4">Ações Rápidas</h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                                    <Upload className="h-5 w-5 text-gray-500" />
                                    <span className="text-sm">Importar Extrato</span>
                                </button>
                                <button className="w-full flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                                    <RefreshCw className="h-5 w-5 text-gray-500" />
                                    <span className="text-sm">Conciliar Automático</span>
                                </button>
                                <button className="w-full flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                                    <Download className="h-5 w-5 text-gray-500" />
                                    <span className="text-sm">Exportar Relatório</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Lista de Lançamentos */}
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
                                            Valor Sistema
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Valor Banco
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Diferença
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(transaction.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {transaction.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm font-medium ${
                                                    transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {formatCurrency(transaction.amount)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm font-medium ${
                                                    transaction.bankAmount >= 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {formatCurrency(transaction.bankAmount)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm font-medium ${
                                                    transaction.difference === 0 ? 'text-gray-900' : 'text-red-600'
                                                }`}>
                                                    {formatCurrency(transaction.difference)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(transaction.status)}
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        getStatusColor(transaction.status)
                                                    }`}>
                                                        {transaction.status === 'reconciled' ? 'Conciliado' :
                                                         transaction.status === 'pending' ? 'Pendente' : 'Divergente'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button className="text-blue-600 hover:text-blue-800">
                                                    Conciliar
                                                </button>
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
