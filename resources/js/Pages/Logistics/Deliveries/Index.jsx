import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Badge } from '@/Components/ui/badge';
import {
    Search,
    Plus,
    ArrowUpDown,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';

export default function Index({ deliveries, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || 'all');

    const statusColors = {
        pending: 'yellow',
        in_transit: 'blue',
        delivered: 'green',
        cancelled: 'red'
    };

    const statusLabels = {
        pending: 'Pendente',
        in_transit: 'Em Trânsito',
        delivered: 'Entregue',
        cancelled: 'Cancelado'
    };

    function handleFilterChange(field, value) {
        window.location.href = route('logistics.deliveries.index', {
            ...filters,
            [field]: value
        });
    }

    function formatDate(date) {
        return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Entregas" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                                placeholder="Buscar..."
                                value={search}
                                onChange={e => handleFilterChange('search', e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select
                            value={status}
                            onValueChange={value => handleFilterChange('status', value)}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="pending">Pendentes</SelectItem>
                                <SelectItem value="in_transit">Em Trânsito</SelectItem>
                                <SelectItem value="delivered">Entregues</SelectItem>
                                <SelectItem value="cancelled">Cancelados</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button asChild>
                            <Link href={route('logistics.deliveries.create')} className="gap-2">
                                <Plus className="w-4 h-4" />
                                Nova Entrega
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pedido</TableHead>
                                <TableHead>Transportadora</TableHead>
                                <TableHead>Código de Rastreio</TableHead>
                                <TableHead>Previsão de Entrega</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {deliveries?.data?.map(delivery => (
                                <TableRow key={delivery.id}>
                                    <TableCell>#{delivery.order.number}</TableCell>
                                    <TableCell>{delivery.carrier.name}</TableCell>
                                    <TableCell>{delivery.tracking_code}</TableCell>
                                    <TableCell>{formatDate(delivery.estimated_delivery)}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusColors[delivery.status]}>
                                            {statusLabels[delivery.status]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={route('logistics.deliveries.show', delivery.id)}
                                                        className="flex items-center"
                                                    >
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Visualizar
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={route('logistics.deliveries.edit', delivery.id)}
                                                        className="flex items-center"
                                                    >
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Editar
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        if (confirm('Tem certeza que deseja excluir esta entrega?')) {
                                                            router.delete(route('logistics.deliveries.destroy', delivery.id));
                                                        }
                                                    }}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {(!deliveries?.data || deliveries.data.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        Nenhuma entrega encontrada
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
