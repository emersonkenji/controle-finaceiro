import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import {
    Package,
    Search,
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    Box,
    History,
    Layers,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Download,
    Copy
} from 'lucide-react';
import Pagination from '@/Components/Pagination';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";

export default function ProductsIndex({ products, categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [sortField, setSortField] = useState(filters.sort || 'name');
    const [sortDirection, setSortDirection] = useState(filters.direction || 'asc');
    const [productToDelete, setProductToDelete] = useState(null);

    const { post, processing } = useForm();

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field) => {
        if (field !== sortField) return <ArrowUpDown className="w-4 h-4" />;
        return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const handleExport = () => {
        post(route('products.export'), {
            data: {
                search,
                category: selectedCategory,
                status: selectedStatus,
                sort: sortField,
                direction: sortDirection
            },
            preserveScroll: true
        });
    };

    const handleDelete = () => {
        if (!productToDelete) return;

        post(route('products.destroy', productToDelete), {
            method: 'delete',
            preserveScroll: true,
            onSuccess: () => {
                setProductToDelete(null);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Produtos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Package className="w-6 h-6 text-gray-600" />
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        Produtos
                                    </h2>
                                </div>
                                <Link href={route('products.create')}>
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Novo Produto
                                    </Button>
                                </Link>
                            </div>

                            {/* Filtros e Busca */}
                            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-4">
                                <div className="relative">
                                    <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                    <Input
                                        type="text"
                                        placeholder="Buscar produtos..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <Select
                                    value={selectedCategory}
                                    onValueChange={setSelectedCategory}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Todas as categorias</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={selectedStatus}
                                    onValueChange={setSelectedStatus}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Todos os status</SelectItem>
                                        <SelectItem value="active">Ativo</SelectItem>
                                        <SelectItem value="inactive">Inativo</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    onClick={handleExport}
                                    disabled={processing}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    {processing ? 'Exportando...' : 'Exportar'}
                                </Button>
                            </div>
                        </div>

                        {/* Tabela de Produtos */}
                        <div className="p-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Imagem</TableHead>
                                        <TableHead>
                                            <button
                                                onClick={() => handleSort('name')}
                                                className="flex items-center gap-1"
                                            >
                                                Nome
                                                {getSortIcon('name')}
                                            </button>
                                        </TableHead>
                                        <TableHead>
                                            <button
                                                onClick={() => handleSort('sku')}
                                                className="flex items-center gap-1"
                                            >
                                                SKU
                                                {getSortIcon('sku')}
                                            </button>
                                        </TableHead>
                                        <TableHead>Categoria</TableHead>
                                        <TableHead>
                                            <button
                                                onClick={() => handleSort('price')}
                                                className="flex items-center gap-1"
                                            >
                                                Preço
                                                {getSortIcon('price')}
                                            </button>
                                        </TableHead>
                                        <TableHead>
                                            <button
                                                onClick={() => handleSort('stock')}
                                                className="flex items-center gap-1"
                                            >
                                                Estoque
                                                {getSortIcon('stock')}
                                            </button>
                                        </TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[100px]">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.data.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                {product.images?.[0] ? (
                                                    <img
                                                        src={`/storage/${product.images[0].path}`}
                                                        alt={product.name}
                                                        className="object-cover w-16 h-16 rounded-lg"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg">
                                                        <Package className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{product.name}</p>
                                                    <p className="text-sm text-gray-500">{product.description}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>{product.sku}</TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {product.category.name}
                                                </span>
                                            </TableCell>
                                            <TableCell>{formatCurrency(product.price)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Box className={`h-4 w-4 ${
                                                        product.stock <= product.min_stock
                                                            ? 'text-red-500'
                                                            : 'text-green-500'
                                                    }`} />
                                                    <span>{product.stock}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    product.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {product.status === 'active' ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="w-8 h-8 p-0">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <Link href={route('products.edit', product.id)}>
                                                            <DropdownMenuItem>
                                                                <Edit className="w-4 h-4 mr-2" />
                                                                Editar
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        <Link href={route('products.variations.index', product.id)}>
                                                            <DropdownMenuItem>
                                                                <Layers className="w-4 h-4 mr-2" />
                                                                Variações
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        <Link href={route('products.stock.index', product.id)}>
                                                            <DropdownMenuItem>
                                                                <Box className="w-4 h-4 mr-2" />
                                                                Estoque
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        <Link href={route('products.stock.history', product.id)}>
                                                            <DropdownMenuItem>
                                                                <History className="w-4 h-4 mr-2" />
                                                                Histórico
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                post(route('products.duplicate', product.id), {
                                                                    preserveScroll: true,
                                                                });
                                                            }}
                                                        >
                                                            <Copy className="w-4 h-4 mr-2" />
                                                            Duplicar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => setProductToDelete(product)}
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

                            {/* Paginação */}
                            {products.links && (
                                <div className="mt-4">
                                    <Pagination links={products} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir o produto "{productToDelete?.name}"?
                            Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleDelete}
                            disabled={processing}
                        >
                            {processing ? 'Excluindo...' : 'Excluir'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AuthenticatedLayout>
    );
}
