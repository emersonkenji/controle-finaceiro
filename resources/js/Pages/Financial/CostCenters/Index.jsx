import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowUpDown,
    Plus,
    Search,
    FileEdit,
    Trash2,
    Filter,
    GripVertical,
    BarChart2
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

export default function Index({ costCenters, filters, parents }) {
    const [filterOpen, setFilterOpen] = useState(false);

    function handleFilterChange(field, value) {
        router.get(route('financial.cost-centers.index'), {
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
            <Head title="Centros de Custo" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Centros de Custo</h1>

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
                                        <Label>Status</Label>
                                        <Select
                                            value={filters.active}
                                            onValueChange={(value) => handleFilterChange('active', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Todos" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">Todos</SelectItem>
                                                <SelectItem value="1">Ativo</SelectItem>
                                                <SelectItem value="0">Inativo</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                            <Link href={route('financial.cost-centers.create')} className="gap-2">
                                <Plus className="w-4 h-4" />
                                Novo Centro de Custo
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40px]"></TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSort('name')}
                                        className="gap-2"
                                    >
                                        Nome
                                        <ArrowUpDown className="w-4 h-4" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSort('code')}
                                        className="gap-2"
                                    >
                                        Código
                                        <ArrowUpDown className="w-4 h-4" />
                                    </Button>
                                </TableHead>
                                <TableHead>Centro de Custo Pai</TableHead>
                                <TableHead>Orçamento</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Transações</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {costCenters.data.map((costCenter) => (
                                <TableRow key={costCenter.id}>
                                    <TableCell>
                                        <GripVertical className="w-4 h-4 text-gray-400" />
                                    </TableCell>
                                    <TableCell>{costCenter.name}</TableCell>
                                    <TableCell>{costCenter.code}</TableCell>
                                    <TableCell>{costCenter.parent?.name}</TableCell>
                                    <TableCell>{formatCurrency(costCenter.budget)}</TableCell>
                                    <TableCell>
                                        <Badge variant={costCenter.active ? 'success' : 'secondary'}>
                                            {costCenter.active ? 'Ativo' : 'Inativo'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{costCenter.transactions_count}</TableCell>
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
                                                        href={route('financial.cost-centers.report', costCenter.id)}
                                                        className="gap-2"
                                                    >
                                                        <BarChart2 className="w-4 h-4" />
                                                        Relatório
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={route('financial.cost-centers.edit', costCenter.id)}
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
                                                                    Tem certeza que deseja excluir este centro de custo?
                                                                    Esta ação não pode ser desfeita.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => router.delete(
                                                                        route('financial.cost-centers.destroy', costCenter.id)
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
