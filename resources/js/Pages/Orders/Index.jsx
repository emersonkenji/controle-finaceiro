import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Plus, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function OrdersIndex({ orders, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [paymentStatus, setPaymentStatus] = useState(filters.payment_status || 'all');

    const handleSearch = (value) => {
        router.get(route('orders.index'), {
            search: value,
            status: status === 'all' ? '' : status,
            payment_status: paymentStatus === 'all' ? '' : paymentStatus
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const handleStatusChange = (value) => {
        setStatus(value);
        router.get(route('orders.index'), {
            search,
            status: value === 'all' ? '' : value,
            payment_status: paymentStatus === 'all' ? '' : paymentStatus
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const handlePaymentStatusChange = (value) => {
        setPaymentStatus(value);
        router.get(route('orders.index'), {
            search,
            status: status === 'all' ? '' : status,
            payment_status: value === 'all' ? '' : value
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'warning',
            processing: 'info',
            completed: 'success',
            cancelled: 'destructive'
        };

        const labels = {
            pending: 'Pendente',
            processing: 'Em Processamento',
            completed: 'Concluído',
            cancelled: 'Cancelado'
        };

        return (
            <Badge variant={variants[status]}>
                {labels[status]}
            </Badge>
        );
    };

    const getPaymentStatusBadge = (status) => {
        const variants = {
            pending: 'warning',
            partial: 'info',
            paid: 'success'
        };

        const labels = {
            pending: 'Pendente',
            partial: 'Parcial',
            paid: 'Pago'
        };

        return (
            <Badge variant={variants[status]}>
                {labels[status]}
            </Badge>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Vendas" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold">Lista de Vendas</h2>
                                <div className="flex items-center space-x-4">
                                    <Button asChild>
                                        <a href={route('orders.create')}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Nova Venda
                                        </a>
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative flex-1">
                                    <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                    <Input
                                        type="text"
                                        placeholder="Buscar vendas..."
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            handleSearch(e.target.value);
                                        }}
                                        className="pl-9"
                                    />
                                </div>
                                <Select
                                    value={status}
                                    onValueChange={handleStatusChange}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos os status</SelectItem>
                                        <SelectItem value="pending">Pendente</SelectItem>
                                        <SelectItem value="processing">Em Processamento</SelectItem>
                                        <SelectItem value="completed">Concluído</SelectItem>
                                        <SelectItem value="cancelled">Cancelado</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={paymentStatus}
                                    onValueChange={handlePaymentStatusChange}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Status de Pagamento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos os status</SelectItem>
                                        <SelectItem value="pending">Pendente</SelectItem>
                                        <SelectItem value="partial">Parcial</SelectItem>
                                        <SelectItem value="paid">Pago</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Número</TableHead>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Status Pagamento</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead className="w-[100px]">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.data.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>{order.number}</TableCell>
                                            <TableCell>{order.customer.name}</TableCell>
                                            <TableCell>
                                                {format(new Date(order.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                                            <TableCell>{getPaymentStatusBadge(order.payment_status)}</TableCell>
                                            <TableCell>{formatCurrency(order.total)}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a href={route('orders.show', order.id)}>
                                                        Ver Detalhes
                                                    </a>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
