import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';

export default function Performance({ employee, performance }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Desempenho - ${employee.name}`} />

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center mb-6">
                    <Link href={route('employees.index')}>
                        <Button variant="ghost" className="mr-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-semibold">Desempenho - {employee.name}</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total de Vendas
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{performance.total_sales}</div>
                            <p className="text-xs text-muted-foreground">
                                Nos últimos 30 dias
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Valor Total em Vendas
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(performance.total_amount)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Nos últimos 30 dias
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total em Comissões
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(performance.total_commission)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Nos últimos 30 dias
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Vendas por Dia</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={performance.daily_sales}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" tickFormatter={formatDate} />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(value) => [value, 'Vendas']}
                                            labelFormatter={formatDate}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="sales"
                                            name="Vendas"
                                            stroke="#8884d8"
                                            activeDot={{ r: 8 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Valor das Vendas por Dia</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={performance.daily_amount}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" tickFormatter={formatDate} />
                                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                                        <Tooltip
                                            formatter={(value) => [formatCurrency(value), 'Valor']}
                                            labelFormatter={formatDate}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="amount"
                                            name="Valor"
                                            stroke="#82ca9d"
                                            activeDot={{ r: 8 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Últimas Vendas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Pedido</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Valor</TableHead>
                                    <TableHead>Comissão</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {performance.recent_sales.map(sale => (
                                    <TableRow key={sale.id}>
                                        <TableCell>{formatDate(sale.date)}</TableCell>
                                        <TableCell>#{sale.number}</TableCell>
                                        <TableCell>{sale.customer_name}</TableCell>
                                        <TableCell>{formatCurrency(sale.amount)}</TableCell>
                                        <TableCell>{formatCurrency(sale.commission)}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-sm ${
                                                sale.status === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : sale.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {sale.status === 'completed' ? 'Concluído'
                                                    : sale.status === 'pending' ? 'Pendente'
                                                    : 'Cancelado'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
