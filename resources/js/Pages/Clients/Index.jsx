import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search,
    UserPlus,
    Filter,
    Phone,
    Mail,
    MapPin,
    Star,
    History
} from 'lucide-react';

export default function ClientsIndex() {
    const [searchTerm, setSearchTerm] = useState('');

    // Dados de exemplo - posteriormente virão do backend
    const clients = [
        {
            id: 1,
            name: 'João Silva',
            email: 'joao@email.com',
            phone: '(11) 99999-9999',
            cpf: '123.456.789-00',
            status: 'Ativo',
            category: 'Premium',
            lastPurchase: '2024-02-20',
            score: 85
        },
        // Mais clientes serão adicionados aqui
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Clientes
                    </h2>
                    <Link
                        href={route('clients.create')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <UserPlus className="h-5 w-5" />
                        Novo Cliente
                    </Link>
                </div>
            }
        >
            <Head title="Clientes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Barra de Pesquisa e Filtros */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar clientes..."
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                                    <Filter className="h-5 w-5" />
                                    Filtros
                                </button>
                            </div>
                        </div>

                        {/* Tabela de Clientes */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cliente
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contato
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Categoria
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Score
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Última Compra
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {clients.map((client) => (
                                        <tr key={client.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {client.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {client.cpf}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-1">
                                                    <div className="text-sm text-gray-900 flex items-center gap-2">
                                                        <Phone className="h-4 w-4" />
                                                        {client.phone}
                                                    </div>
                                                    <div className="text-sm text-gray-500 flex items-center gap-2">
                                                        <Mail className="h-4 w-4" />
                                                        {client.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    {client.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-4 w-4 text-yellow-400" />
                                                    <span className="text-sm text-gray-900">{client.score}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(client.lastPurchase).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-3">
                                                    <button className="text-indigo-600 hover:text-indigo-900">
                                                        <MapPin className="h-5 w-5" />
                                                    </button>
                                                    <button className="text-gray-600 hover:text-gray-900">
                                                        <History className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
