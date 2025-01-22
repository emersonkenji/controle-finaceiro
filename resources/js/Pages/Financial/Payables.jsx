import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search,
    Filter,
    Plus,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    MoreHorizontal,
    Download,
    Building,
    Calendar
} from 'lucide-react';

export default function PayablesIndex() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Dados de exemplo - posteriormente virão do backend
    const payables = [
        {
            id: 1,
            description: 'Fornecedor ABC',
            supplier: 'ABC Materiais',
            amount: 2500.00,
            dueDate: '2024-02-25',
            status: 'pending',
            category: 'Fornecedores',
            installment: '1/2'
        },
        {
            id: 2,
            description: 'Aluguel Comercial',
            supplier: 'Imobiliária XYZ',
            amount: 3500.00,
            dueDate: '2024-02-20',
            status: 'paid',
            category: 'Aluguel',
            installment: null
        }
    ];

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
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'paid':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'overdue':
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
                        Contas a Pagar
                    </h2>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                            <Download className="h-5 w-5 text-gray-500" />
                            Exportar
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <Plus className="h-5 w-5" />
                            Nova Conta
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Contas a Pagar" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Filtros e Busca */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar por descrição, fornecedor..."
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full sm:w-48 rounded-lg border-gray-300"
                                >
                                    <option value="all">Todos os Status</option>
                                    <option value="pending">Pendentes</option>
                                    <option value="paid">Pagos</option>
                                    <option value="overdue">Vencidos</option>
                                </select>
                                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                                    <Filter className="h-5 w-5" />
                                    Mais Filtros
                                </button>
                            </div>
                        </div>

                        {/* Resumo */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 border-b border-gray-200">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm font-medium text-gray-500">Total a Pagar</div>
                                <div className="mt-1 text-xl font-semibold text-gray-900">R$ 15.780,00</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm font-medium text-gray-500">Vence Hoje</div>
                                <div className="mt-1 text-xl font-semibold text-gray-900">R$ 2.500,00</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm font-medium text-gray-500">Próximos 7 dias</div>
                                <div className="mt-1 text-xl font-semibold text-gray-900">R$ 8.900,00</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm font-medium text-gray-500">Vencidas</div>
                                <div className="mt-1 text-xl font-semibold text-red-600">R$ 1.200,00</div>
                            </div>
                        </div>

                        {/* Tabela */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Descrição
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fornecedor
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Valor
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Vencimento
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
                                    {payables.map((payable) => (
                                        <tr key={payable.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {payable.description}
                                                        </div>
                                                        {payable.installment && (
                                                            <div className="text-sm text-gray-500">
                                                                Parcela {payable.installment}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Building className="h-4 w-4 text-gray-400 mr-2" />
                                                    <div className="text-sm text-gray-900">
                                                        {payable.supplier}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatCurrency(payable.amount)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                    <div className="text-sm text-gray-900">
                                                        {formatDate(payable.dueDate)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(payable.status)}
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        getStatusColor(payable.status)
                                                    }`}>
                                                        {payable.status === 'paid' ? 'Pago' :
                                                         payable.status === 'pending' ? 'Pendente' : 'Vencido'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button className="text-gray-400 hover:text-gray-500">
                                                    <MoreHorizontal className="h-5 w-5" />
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
                                    Mostrando 1-10 de 35 resultados
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
