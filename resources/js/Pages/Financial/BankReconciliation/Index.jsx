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
    Edit,
    Trash2
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';

export default function Index({ reconciliations, filters }) {
    const [data, setData] = useState(reconciliations);

    const statusColors = {
        pending: 'yellow',
        reconciled: 'green',
        cancelled: 'red'
    };

    const statusLabels = {
        pending: 'Pendente',
        reconciled: 'Conciliado',
        cancelled: 'Cancelado'
    };

    function handleFilterChange(field, value) {
        const newFilters = { ...filters, [field]: value };
        window.location.href = route('financial.bank-reconciliation.index', newFilters);
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
            <Head title="Conciliação Bancária" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                                placeholder="Buscar..."
                                value={filters?.search || ''}
                                onChange={e => handleFilterChange('search', e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select
                            value={filters?.status || 'all'}
                            onValueChange={value => handleFilterChange('status', value)}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="pending">Pendentes</SelectItem>
                                <SelectItem value="reconciled">Conciliados</SelectItem>
                                <SelectItem value="cancelled">Cancelados</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button asChild>
                            <Link href={route('financial.bank-reconciliation.create')} className="gap-2">
                                <Plus className="w-4 h-4" />
                                Nova Conciliação
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Conta</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.map(reconciliation => (
                                <TableRow key={reconciliation.id}>
                                    <TableCell>{formatDate(reconciliation.date)}</TableCell>
                                    <TableCell>{reconciliation.description}</TableCell>
                                    <TableCell>{formatCurrency(reconciliation.amount)}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusColors[reconciliation.status]}>
                                            {statusLabels[reconciliation.status]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{reconciliation.account?.name}</TableCell>
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
                                                        href={route('financial.bank-reconciliation.edit', reconciliation.id)}
                                                        className="flex items-center"
                                                    >
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Editar
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(reconciliation)}
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

                            {(!data || data.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        Nenhuma conciliação bancária encontrada
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
