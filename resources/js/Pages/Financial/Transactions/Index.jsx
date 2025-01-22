import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    ArrowUpDown,
    Plus,
    Search,
    FileEdit,
    Trash2,
    Download,
    Filter
} from 'lucide-react';

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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/Components/ui/alert-dialog';
import { Badge } from '@/Components/ui/badge';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/Components/ui/sheet';

export default function Index({ transactions, filters, categories, costCenters }) {
    const [filterOpen, setFilterOpen] = useState(false);

    const statusColors = {
        pending: 'yellow',
        paid: 'green',
        cancelled: 'red'
    };

    const statusLabels = {
        pending: 'Pendente',
        paid: 'Pago',
        cancelled: 'Cancelado'
    };

    const typeLabels = {
        receivable: 'Receber',
        payable: 'Pagar'
    };

    function handleFilterChange(field, value) {
        router.get(route('financial.transactions.index'), {
            ...filters,
            [field]: value
        }, {
            preserveState: true,
            preserveScroll: true
        });
    }

    function handleSort(field) {
        const direction = filters.sort === field && filters.direction === 'asc' ? 'desc' : 'asc';
        handleFilterChange('sort', field);
        handleFilterChange('direction', direction);
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    return (
        <AuthenticatedLayout>
            <Head title="Transações" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Transações</h1>

                    <div className="flex items-center gap-4">
                        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <Filter className="w-4 h-4" />
                                    Filtros
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Filtros</SheetTitle>
                                </SheetHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label>Tipo</Label>
                                        <Select
                                            value={filters.type}
                                            onValueChange={(value) => handleFilterChange('type', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Todos" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">Todos</SelectItem>
                                                <SelectItem value="receivable">A Receber</SelectItem>
                                                <SelectItem value="payable">A Pagar</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Status</Label>
                                        <Select
                                            value={filters.status}
                                            onValueChange={(value) => handleFilterChange('status', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Todos" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Todos</SelectItem>
                                                <SelectItem value="pending">Pendente</SelectItem>
                                                <SelectItem value="paid">Pago</SelectItem>
                                                <SelectItem value="cancelled">Cancelado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Categoria</Label>
                                        <Select
                                            value={filters.category_id}
                                            onValueChange={(value) => handleFilterChange('category_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Todas" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Todas</SelectItem>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Centro de Custo</Label>
                                        <Select
                                            value={filters.cost_center_id}
                                            onValueChange={(value) => handleFilterChange('cost_center_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Todos" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Todos</SelectItem>
                                                {costCenters.map((costCenter) => (
                                                    <SelectItem key={costCenter.id} value={costCenter.id.toString()}>
                                                        {costCenter.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Data Inicial</Label>
                                        <Input
                                            type="date"
                                            value={filters.start_date}
                                            onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Data Final</Label>
                                        <Input
                                            type="date"
                                            value={filters.end_date}
                                            onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>

                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Buscar..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-[300px]"
                            />
                            <Button variant="outline" size="icon">
                                <Search className="w-4 h-4" />
                            </Button>
                        </div>

                        <Button asChild>
                            <Link href={route('financial.transactions.create')} className="gap-2">
                                <Plus className="w-4 h-4" />
                                Nova Transação
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
                                <TableHead>Tipo</TableHead>
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
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.data.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>{transaction.description}</TableCell>
                                    <TableCell>{typeLabels[transaction.type]}</TableCell>
                                    <TableCell>
                                        {format(new Date(transaction.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                                    </TableCell>
                                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusColors[transaction.status]}>
                                            {statusLabels[transaction.status]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{transaction.category?.name}</TableCell>
                                    <TableCell>{transaction.cost_center?.name}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={route('financial.transactions.edit', transaction.id)}
                                                        className="gap-2"
                                                    >
                                                        <FileEdit className="w-4 h-4" />
                                                        Editar
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger className="w-full flex items-center gap-2 text-red-500">
                                                            <Trash2 className="w-4 h-4" />
                                                            Excluir
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Confirmar exclusão
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Tem certeza que deseja excluir esta transação?
                                                                    Esta ação não pode ser desfeita.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => router.delete(
                                                                        route('financial.transactions.destroy', transaction.id)
                                                                    )}
                                                                    className="bg-red-500 hover:bg-red-600"
                                                                >
                                                                    Excluir
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
