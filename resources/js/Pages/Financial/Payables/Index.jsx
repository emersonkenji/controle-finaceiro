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
    FileText,
    Download,
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
import { DataTable } from '@/Components/ui/data-table';
import { columns } from './Columns';

export default function Index({ payables, filters }) {
    const [filterOpen, setFilterOpen] = useState(false);
    const [data, setData] = useState(payables);

    const statusColors = {
        pending: 'yellow',
        paid: 'green',
        cancelled: 'red',
        overdue: 'red'
    };

    const statusLabels = {
        pending: 'Pendente',
        paid: 'Pago',
        cancelled: 'Cancelado',
        overdue: 'Vencido'
    };

    function handleFilterChange(field, value) {
        const newFilters = { ...filters, [field]: value };
        window.location.href = route('financial.payables.index', newFilters);
    }

    function handleSort(field) {
        const direction = filters.sort_field === field && filters.sort_direction === 'asc' ? 'desc' : 'asc';
        handleFilterChange('sort_field', field);
        handleFilterChange('sort_direction', direction);
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    function formatDate(date) {
        return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Contas a Pagar" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 left-3 top-1/2" />
                            <Input
                                placeholder="Buscar..."
                                value={filters.search || ''}
                                onChange={e => handleFilterChange('search', e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select
                            value={filters.status || 'all'}
                            onValueChange={value => handleFilterChange('status', value)}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="pending">Pendentes</SelectItem>
                                <SelectItem value="paid">Pagos</SelectItem>
                                <SelectItem value="cancelled">Cancelados</SelectItem>
                                <SelectItem value="overdue">Vencidos</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button asChild>
                            <Link href={route('financial.payables.create')} className="gap-2">
                                <Plus className="w-4 h-4" />
                                Nova Conta
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSort('description')}
                                        className="gap-2"
                                    >
                                        Descrição
                                        <ArrowUpDown className="w-4 h-4" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSort('due_date')}
                                        className="gap-2"
                                    >
                                        Vencimento
                                        <ArrowUpDown className="w-4 h-4" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSort('amount')}
                                        className="gap-2"
                                    >
                                        Valor
                                        <ArrowUpDown className="w-4 h-4" />
                                    </Button>
                                </TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Centro de Custo</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payables.data.map(payable => (
                                <TableRow key={payable.id}>
                                    <TableCell>{payable.description}</TableCell>
                                    <TableCell>{formatDate(payable.due_date)}</TableCell>
                                    <TableCell>{formatCurrency(payable.amount)}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusColors[payable.status]}>
                                            {statusLabels[payable.status]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{payable.category?.name}</TableCell>
                                    <TableCell>{payable.cost_center?.name}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="w-8 h-8 p-0">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={route('financial.payables.edit', payable.id)}
                                                        className="flex items-center"
                                                    >
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Editar
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(payable)}
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

                            {payables.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-8 text-center">
                                        Nenhuma conta a pagar encontrada
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
