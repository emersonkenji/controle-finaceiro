import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Search, Download } from 'lucide-react';

export default function Index({ sales, totals, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [startDate, setStartDate] = useState(filters?.start_date || '');
    const [endDate, setEndDate] = useState(filters?.end_date || '');
    const [status, setStatus] = useState(filters?.status || 'all');

    function handleFilterChange(field, value) {
        window.location.href = route('reports.sales.index', {
            ...filters,
            [field]: value
        });
    }

    function formatDate(date) {
        return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

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

    return (
        <AuthenticatedLayout>
            <Head title="Relatório de Vendas" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Relatório de Vendas</h2>
                    <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Exportar
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-gray-500">Total de Vendas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totals.count}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-gray-500">Valor Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totals.amount)}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-gray-500">Lucro Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totals.profit)}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <div className="flex flex-col gap-4 md:flex-row">
                            <div className="relative flex-1">
                                <Search className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 left-3 top-1/2" />
                                <Input
                                    placeholder="Buscar..."
                                    value={search}
                                    onChange={e => handleFilterChange('search', e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={e => handleFilterChange('start_date', e.target.value)}
                                />
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={e => handleFilterChange('end_date', e.target.value)}
                                />
                                <Select
                                    value={status}
                                    onValueChange={value => handleFilterChange('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="pending">Pendente</SelectItem>
                                        <SelectItem value="paid">Pago</SelectItem>
                                        <SelectItem value="cancelled">Cancelado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Lucro</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sales.data.map(sale => (
                                <TableRow key={sale.id}>
                                    <TableCell>{formatDate(sale.created_at)}</TableCell>
                                    <TableCell>{sale.customer.name}</TableCell>
                                    <TableCell>{formatCurrency(sale.total_amount)}</TableCell>
                                    <TableCell>{formatCurrency(sale.profit)}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusColors[sale.status]}>
                                            {statusLabels[sale.status]}
                                        </Badge>
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
