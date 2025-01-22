import { useState, useCallback, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
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
    Copy,
    Eye,
    Badge,
    MoreHorizontal,
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
import { useDebounce } from '@/hooks/useDebounce';
import axios from 'axios';

export default function ProductsIndex({ products, categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category_id || 'all');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [sortField, setSortField] = useState(filters.sort || 'name');
    const [sortDirection, setSortDirection] = useState(filters.direction || 'asc');
    const [productToDelete, setProductToDelete] = useState(null);
    const [processing, setProcessing] = useState(false);

    const { post, processing: formProcessing } = useForm();

    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        router.get(route('products.index'), {
            search: debouncedSearch,
            category_id: selectedCategory === 'all' ? '' : selectedCategory,
            status: selectedStatus === 'all' ? '' : selectedStatus
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    }, [debouncedSearch, selectedCategory, selectedStatus]);

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
        setProcessing(true);
        axios.post(route('products.export'), {
            search,
            category_id: selectedCategory === 'all' ? '' : selectedCategory,
            status: selectedStatus === 'all' ? '' : selectedStatus
        }, {
            responseType: 'blob'
        })
        .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'produtos.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Erro ao exportar produtos:', error);
        })
        .finally(() => {
            setProcessing(false);
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
                                        <SelectItem value="all">Todas as categorias</SelectItem>
                                        {categories?.length > 0 && categories.map((category) => (
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
                                        <SelectItem value="all">Todos os status</SelectItem>
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
                                                {product.images?.length > 0 ? (
                                                    <img
                                                        src={`/storage/${product.images.find(img => img.is_main)?.path || product.images[0].path}`}
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
                                                    {product.category?.name || '-'}
                                                </span>
                                            </TableCell>
                                            <TableCell>{formatCurrency(product.price)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span>{product.stock}</span>
                                                    {product.stock <= product.min_stock && (
                                                        <Badge variant="destructive">Baixo</Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={product.status === 'active' ? 'success' : 'secondary'}>
                                                    {product.status === 'active' ? 'Ativo' : 'Inativo'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="w-8 h-8 p-0">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('products.show', product.id)}>
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                Visualizar
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('products.edit', product.id)}>
                                                                <Edit className="w-4 h-4 mr-2" />
                                                                Editar
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('products.variations.index', product.id)}>
                                                                <Layers className="w-4 h-4 mr-2" />
                                                                Variações
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('products.stock.index', product.id)}>
                                                                <Package className="w-4 h-4 mr-2" />
                                                                Estoque
                                                            </Link>
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
                            disabled={formProcessing}
                        >
                            {formProcessing ? 'Excluindo...' : 'Excluir'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AuthenticatedLayout>
    );
}
