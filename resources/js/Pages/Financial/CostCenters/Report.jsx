import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

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
import { Progress } from '@/Components/ui/progress';

export default function Report({ costCenter, transactions }) {
    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    function formatDate(date) {
        return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Relatório - ${costCenter.name}`} />

            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="text-2xl font-semibold">
                        Relatório - {costCenter.name}
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                            Orçamento
                        </h3>
                        <p className="text-2xl font-semibold">
                            {formatCurrency(costCenter.budget)}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                            Total Gasto
                        </h3>
                        <p className="text-2xl font-semibold text-red-600">
                            {formatCurrency(costCenter.total_spent)}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                            Saldo
                        </h3>
                        <p className="text-2xl font-semibold text-green-600">
                            {formatCurrency(costCenter.budget_balance)}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Utilização do Orçamento
                    </h3>
                    <Progress value={costCenter.budget_usage} className="mb-2" />
                    <p className="text-sm text-gray-500 text-right">
                        {costCenter.budget_usage}%
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.data.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>
                                        {formatDate(transaction.due_date)}
                                    </TableCell>
                                    <TableCell>{transaction.description}</TableCell>
                                    <TableCell>{transaction.category.name}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            transaction.status === 'paid'
                                                ? 'bg-green-100 text-green-800'
                                                : transaction.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {transaction.status === 'paid'
                                                ? 'Pago'
                                                : transaction.status === 'pending'
                                                ? 'Pendente'
                                                : 'Atrasado'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(transaction.amount)}
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
