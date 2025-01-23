import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Search, Download } from 'lucide-react';

export default function Index({ products, totals, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [stockStatus, setStockStatus] = useState(filters?.stock_status || 'all');

    function handleFilterChange(field, value) {
        window.location.href = route('reports.inventory.index', {
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
            <Head title="Relatório de Estoque" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Relatório de Estoque</h2>
                    <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Exportar
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-gray-500">Total de Produtos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totals.total_products}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-gray-500">Valor Total em Estoque</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totals.total_value)}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-gray-500">Estoque Baixo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totals.low_stock}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-gray-500">Sem Estoque</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totals.out_of_stock}</div>
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
                            <Select
                                value={stockStatus}
                                onValueChange={value => handleFilterChange('stock_status', value)}
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Status do Estoque" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="low">Estoque Baixo</SelectItem>
                                    <SelectItem value="out">Sem Estoque</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Estoque</TableHead>
                                <TableHead>Estoque Mínimo</TableHead>
                                <TableHead>Custo Unitário</TableHead>
                                <TableHead>Valor Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.data.map(product => (
                                <TableRow key={product.id}>
                                    <TableCell>{product.sku}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.category.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={product.stock <= product.min_stock ? 'red' : 'green'}>
                                            {product.stock}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{product.min_stock}</TableCell>
                                    <TableCell>{formatCurrency(product.cost)}</TableCell>
                                    <TableCell>{formatCurrency(product.stock * product.cost)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
