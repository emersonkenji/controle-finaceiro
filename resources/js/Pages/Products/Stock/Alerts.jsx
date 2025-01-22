import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Package, ArrowLeft } from 'lucide-react';

export default function StockAlerts({ alerts }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Alertas de Estoque" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Link
                                        href={route('products.index')}
                                        className="flex items-center text-gray-600 hover:text-gray-900"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </Link>
                                    <Package className="w-6 h-6 text-gray-600" />
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        Alertas de Estoque
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Resumo */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 border-b border-gray-200">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Produtos com Estoque Baixo</h3>
                                <p className="mt-2 text-3xl font-semibold">{alerts.lowStock.length}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Produtos sem Estoque</h3>
                                <p className="mt-2 text-3xl font-semibold">{alerts.outOfStock.length}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Variações com Estoque Baixo</h3>
                                <p className="mt-2 text-3xl font-semibold">{alerts.variationsLowStock.length}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Variações sem Estoque</h3>
                                <p className="mt-2 text-3xl font-semibold">{alerts.variationsOutOfStock.length}</p>
                            </div>
                        </div>

                        {/* Lista de Produtos */}
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Produtos</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Imagem</TableHead>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Categoria</TableHead>
                                        <TableHead>Preço</TableHead>
                                        <TableHead>Estoque</TableHead>
                                        <TableHead>Estoque Mínimo</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[...alerts.lowStock, ...alerts.outOfStock].map((product) => (
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
                                                    {product.stock <= 0 ? (
                                                        <Badge variant="destructive">Sem Estoque</Badge>
                                                    ) : (
                                                        <Badge variant="warning">Baixo</Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>{product.min_stock}</TableCell>
                                            <TableCell>
                                                <Badge variant={product.status === 'active' ? 'success' : 'secondary'}>
                                                    {product.status === 'active' ? 'Ativo' : 'Inativo'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Lista de Variações */}
                        {(alerts.variationsLowStock.length > 0 || alerts.variationsOutOfStock.length > 0) && (
                            <div className="p-6 border-t border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Variações</h3>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Produto</TableHead>
                                            <TableHead>Variação</TableHead>
                                            <TableHead>SKU</TableHead>
                                            <TableHead>Preço</TableHead>
                                            <TableHead>Estoque</TableHead>
                                            <TableHead>Estoque Mínimo</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[...alerts.variationsLowStock, ...alerts.variationsOutOfStock].map((variation) => (
                                            <TableRow key={variation.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{variation.product.name}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {variation.product.category?.name || '-'}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{variation.name}</TableCell>
                                                <TableCell>{variation.sku}</TableCell>
                                                <TableCell>{formatCurrency(variation.price || variation.product.price)}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span>{variation.stock}</span>
                                                        {variation.stock <= 0 ? (
                                                            <Badge variant="destructive">Sem Estoque</Badge>
                                                        ) : (
                                                            <Badge variant="warning">Baixo</Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{variation.min_stock}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
