import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Search, Download } from 'lucide-react';

export default function Index({ customers, topProducts, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    function handleFilterChange(field, value) {
        window.location.href = route('reports.customers.index', {
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
            <Head title="Relatório de Clientes" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Relatório de Clientes</h2>
                    <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Exportar
                    </Button>
                </div>

                <div className="bg-white rounded-lg shadow mb-6">
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
                                <TableHead>Nome</TableHead>
                                <TableHead>Documento</TableHead>
                                <TableHead>Total de Pedidos</TableHead>
                                <TableHead>Valor Total</TableHead>
                                <TableHead>Produtos Mais Comprados</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.data.map(customer => (
                                <TableRow key={customer.id}>
                                    <TableCell>{customer.name}</TableCell>
                                    <TableCell>{customer.document}</TableCell>
                                    <TableCell>{customer.orders_count}</TableCell>
                                    <TableCell>{formatCurrency(customer.orders_sum_total_amount)}</TableCell>
                                    <TableCell>
                                        {topProducts[customer.id]?.map((product, index) => (
                                            <div key={index} className="text-sm">
                                                {product.product_name} ({product.total_quantity} un. - {formatCurrency(product.total_amount)})
                                            </div>
                                        ))}
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
