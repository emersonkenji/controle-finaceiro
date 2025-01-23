import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Search, Download } from 'lucide-react';

export default function Index({ products, topSelling, mostProfitable, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    function handleFilterChange(field, value) {
        window.location.href = route('reports.products.index', {
            ...filters,
            [field]: value
        });
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    return (
        <AuthenticatedLayout>
            <Head title="Relatório de Produtos" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Relatório de Produtos</h2>
                    <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Exportar
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Produtos Mais Vendidos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Produto</TableHead>
                                        <TableHead>Quantidade</TableHead>
                                        <TableHead>Valor Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {topSelling.map(product => (
                                        <TableRow key={product.id}>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>{product.total_quantity}</TableCell>
                                            <TableCell>{formatCurrency(product.total_amount)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Produtos Mais Lucrativos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Produto</TableHead>
                                        <TableHead>Lucro Total</TableHead>
                                        <TableHead>Receita Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mostProfitable.map(product => (
                                        <TableRow key={product.id}>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>{formatCurrency(product.total_profit)}</TableCell>
                                            <TableCell>{formatCurrency(product.total_revenue)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                <Input
                                    placeholder="Buscar..."
                                    value={search}
                                    onChange={e => handleFilterChange('search', e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Vendas</TableHead>
                                <TableHead>Valor Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.data.map(product => (
                                <TableRow key={product.id}>
                                    <TableCell>{product.sku}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.category.name}</TableCell>
                                    <TableCell>{product.order_items_count}</TableCell>
                                    <TableCell>{formatCurrency(product.order_items_sum_total)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
