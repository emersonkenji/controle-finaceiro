import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import {
    Users,
    Search,
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    Star,
    History,
    FileText
} from 'lucide-react';
import { Pagination } from "@/Components/ui/pagination";

export default function CustomersIndex({ customers, filters }) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('customers.index'), { search: searchQuery }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (customer) => {
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            router.delete(route('customers.destroy', customer.id));
        }
    };

    const handleEdit = (customer) => {
        router.get(route('customers.edit', customer.id));
    };

    const handleViewHistory = (customer) => {
        router.get(route('customers.history.index', customer.id));
    };

    const handleViewDocuments = (customer) => {
        router.get(route('customers.documents.index', customer.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Clientes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Users className="h-6 w-6 text-gray-600" />
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        Clientes
                                    </h2>
                                </div>
                                <Button onClick={() => router.get(route('customers.create'))}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Novo Cliente
                                </Button>
                            </div>

                            {/* Filtros e Busca */}
                            <form onSubmit={handleSearch} className="mt-4 flex gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Buscar clientes..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <Button type="submit" variant="secondary">
                                    Buscar
                                </Button>
                            </form>
                        </div>

                        {/* Tabela de Clientes */}
                        <div className="p-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Categoria</TableHead>
                                        <TableHead>Score</TableHead>
                                        <TableHead>Total em Compras</TableHead>
                                        <TableHead>Última Compra</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[100px]">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customers.data.map((customer) => (
                                        <TableRow key={customer.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{customer.name}</p>
                                                    <p className="text-sm text-gray-500">{customer.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {customer.category}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-4 w-4 text-yellow-400" />
                                                    <span>{customer.score}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {new Intl.NumberFormat('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                }).format(customer.totalPurchases)}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(customer.lastPurchase).toLocaleDateString('pt-BR')}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    customer.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEdit(customer)}>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleViewHistory(customer)}>
                                                            <History className="h-4 w-4 mr-2" />
                                                            Histórico
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleViewDocuments(customer)}>
                                                            <FileText className="h-4 w-4 mr-2" />
                                                            Documentos
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => handleDelete(customer)}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Excluir
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Paginação */}
                            <div className="mt-4">
                                <Pagination
                                    links={customers.links}
                                    current_page={customers.current_page}
                                    last_page={customers.last_page}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
