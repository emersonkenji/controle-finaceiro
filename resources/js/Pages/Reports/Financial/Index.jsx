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

export default function Index({ transactions, totals, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [startDate, setStartDate] = useState(filters?.start_date || '');
    const [endDate, setEndDate] = useState(filters?.end_date || '');
    const [type, setType] = useState(filters?.type || 'all');
    const [status, setStatus] = useState(filters?.status || 'all');

    function handleFilterChange(field, value) {
        window.location.href = route('reports.financial.index', {
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
        cancelled: 'red',
        overdue: 'red'
    };

    const statusLabels = {
        pending: 'Pendente',
        paid: 'Pago',
        cancelled: 'Cancelado',
        overdue: 'Vencido'
    };

    const typeLabels = {
        receivable: 'A Receber',
        payable: 'A Pagar'
    };

    return (
        <AuthenticatedLayout>
            <Head title="Relatório Financeiro" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Relatório Financeiro</h2>
                    <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Exportar
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-gray-500">Total a Receber</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totals.receivables)}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-gray-500">Total a Pagar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totals.payables)}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-gray-500">Saldo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totals.balance)}</div>
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
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
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
                                    value={type}
                                    onValueChange={value => handleFilterChange('type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="receivable">A Receber</SelectItem>
                                        <SelectItem value="payable">A Pagar</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                        <SelectItem value="overdue">Vencido</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Centro de Custo</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.data.map(transaction => (
                                <TableRow key={transaction.id}>
                                    <TableCell>{formatDate(transaction.due_date)}</TableCell>
                                    <TableCell>{transaction.description}</TableCell>
                                    <TableCell>{typeLabels[transaction.type]}</TableCell>
                                    <TableCell>{transaction.category.name}</TableCell>
                                    <TableCell>{transaction.costCenter.name}</TableCell>
                                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusColors[transaction.status]}>
                                            {statusLabels[transaction.status]}
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
