import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Badge } from '@/Components/ui/badge';
import { Package, Search, Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react';

export default function CategoriesIndex({ categories, allCategories, filters }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parent_id: '',
        status: 'active'
    });

    const handleSearch = (value) => {
        router.get(route('products.categories.index'), {
            search: value,
            status: selectedStatus === 'all' ? '' : selectedStatus
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const handleStatusChange = (value) => {
        setSelectedStatus(value);
        router.get(route('products.categories.index'), {
            search,
            status: value === 'all' ? '' : value
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('products.categories.store'), formData, {
            onSuccess: () => {
                setIsOpen(false);
                setFormData({
                    name: '',
                    description: '',
                    parent_id: '',
                    status: 'active'
                });
            }
        });
    };

    const handleDelete = () => {
        if (!categoryToDelete) return;

        router.delete(route('products.categories.destroy', categoryToDelete.id), {
            onSuccess: () => {
                setCategoryToDelete(null);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Categorias de Produtos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Package className="w-6 h-6 text-gray-600" />
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        Categorias de Produtos
                                    </h2>
                                </div>
                                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Nova Categoria
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Nova Categoria</DialogTitle>
                                            <DialogDescription>
                                                Preencha os detalhes da nova categoria de produtos
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <Label htmlFor="name">Nome</Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={e => setFormData({
                                                        ...formData,
                                                        name: e.target.value
                                                    })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="description">Descrição</Label>
                                                <Textarea
                                                    id="description"
                                                    value={formData.description}
                                                    onChange={e => setFormData({
                                                        ...formData,
                                                        description: e.target.value
                                                    })}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="parent_id">Categoria Pai</Label>
                                                <Select
                                                    value={formData.parent_id}
                                                    onValueChange={value => setFormData({
                                                        ...formData,
                                                        parent_id: value
                                                    })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione uma categoria pai" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">Nenhuma</SelectItem>
                                                        {allCategories?.map(category => (
                                                            <SelectItem
                                                                key={category.id}
                                                                value={category.id.toString()}
                                                            >
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="status">Status</Label>
                                                <Select
                                                    value={formData.status}
                                                    onValueChange={value => setFormData({
                                                        ...formData,
                                                        status: value
                                                    })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="active">Ativo</SelectItem>
                                                        <SelectItem value="inactive">Inativo</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <DialogFooter>
                                                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                                    Cancelar
                                                </Button>
                                                <Button type="submit">Criar</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {/* Filtros e Busca */}
                            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
                                <div className="relative">
                                    <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                    <Input
                                        type="text"
                                        placeholder="Buscar categorias..."
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            handleSearch(e.target.value);
                                        }}
                                        className="pl-9"
                                    />
                                </div>
                                <Select
                                    value={selectedStatus}
                                    onValueChange={handleStatusChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos os status</SelectItem>
                                        <SelectItem value="active">Ativo</SelectItem>
                                        <SelectItem value="inactive">Inativo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Tabela de Categorias */}
                        <div className="p-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead>Categoria Pai</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Produtos</TableHead>
                                        <TableHead className="w-[100px]">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories?.data?.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell>{category.name}</TableCell>
                                            <TableCell>{category.description}</TableCell>
                                            <TableCell>{category.parent?.name || '-'}</TableCell>
                                            <TableCell>
                                                <Badge variant={category.status === 'active' ? 'success' : 'secondary'}>
                                                    {category.status === 'active' ? 'Ativo' : 'Inativo'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{category.products_count}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="w-8 h-8 p-0">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('products.categories.edit', category.id)}>
                                                                <Edit className="w-4 h-4 mr-2" />
                                                                Editar
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => setCategoryToDelete(category)}
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Excluir
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
                </div>
            </div>

            <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir a categoria "{categoryToDelete?.name}"?
                            Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleDelete}
                        >
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AuthenticatedLayout>
    );
}
