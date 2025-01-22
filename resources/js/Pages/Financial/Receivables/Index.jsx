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

export default function Index({ receivables, filters }) {
    const [filterOpen, setFilterOpen] = useState(false);
    const [data, setData] = useState(receivables);

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
        window.location.href = route('financial.receivables.index', newFilters);
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
            <Head title="Contas a Receber" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
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
                            <Link href={route('financial.receivables.create')} className="gap-2">
                                <Plus className="w-4 h-4" />
                                Nova Conta
                            </Link>
                        </Button>
                    </div>
                </div>

                <DataTable columns={columns} data={data} />
            </div>
        </AuthenticatedLayout>
    );
}
