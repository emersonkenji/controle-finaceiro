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
    MoreVertical
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
import { Label } from '@/Components/ui/label';

export default function Index({ categories, filters, parents }) {
    const [filterOpen, setFilterOpen] = useState(false);

    const typeLabels = {
        receivable: 'Receber',
        payable: 'Pagar',
        both: 'Ambos'
    };

    function handleFilterChange(field, value) {
        router.get(route('financial.categories.index'), {
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

    return (
        <AuthenticatedLayout>
            <Head title="Categorias de Transações" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Categorias de Transações</h1>

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
                                                <SelectItem value="all">Todos</SelectItem>
                                                <SelectItem value="receivable">A Receber</SelectItem>
                                                <SelectItem value="payable">A Pagar</SelectItem>
                                                <SelectItem value="both">Ambos</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
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
                                                <SelectItem value="all">Todos</SelectItem>
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
                            <Link href={route('financial.categories.create')} className="gap-2">
                                <Plus className="w-4 h-4" />
                                Nova Categoria
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
                                <TableHead>Tipo</TableHead>
                                <TableHead>Categoria Pai</TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSort('order')}
                                        className="gap-2"
                                    >
                                        Ordem
                                        <ArrowUpDown className="w-4 h-4" />
                                    </Button>
                                </TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.data.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>
                                        <GripVertical className="w-4 h-4 text-gray-400" />
                                    </TableCell>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>{typeLabels[category.type]}</TableCell>
                                    <TableCell>{category.parent?.name}</TableCell>
                                    <TableCell>{category.order}</TableCell>
                                    <TableCell>
                                        <Badge variant={category.active ? 'success' : 'secondary'}>
                                            {category.active ? 'Ativo' : 'Inativo'}
                                        </Badge>
                                    </TableCell>
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
                                                        href={route('financial.categories.edit', category.id)}
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
                                                                    Tem certeza que deseja excluir esta categoria?
                                                                    Esta ação não pode ser desfeita.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => router.delete(
                                                                        route('financial.categories.destroy', category.id)
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
