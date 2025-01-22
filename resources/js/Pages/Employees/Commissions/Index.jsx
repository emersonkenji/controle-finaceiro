import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Search, Trash } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Select } from '@/Components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/Components/ui/alert-dialog';

export default function Index({ commissions, employees, filters }) {
    const [commissionToDelete, setCommissionToDelete] = useState(null);
    const [employeeId, setEmployeeId] = useState(filters.employee_id || '');
    const [status, setStatus] = useState(filters.status || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [sortField, setSortField] = useState(filters.sort_field || 'date');
    const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'desc');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('employees.commissions.index'), {
            employee_id: employeeId,
            status,
            start_date: startDate,
            end_date: endDate,
            sort_field: sortField,
            sort_direction: sortDirection
        }, { preserveState: true });
    };

    const handleSort = (field) => {
        const direction = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(direction);
        router.get(route('employees.commissions.index'), {
            employee_id: employeeId,
            status,
            start_date: startDate,
            end_date: endDate,
            sort_field: field,
            sort_direction: direction
        }, { preserveState: true });
    };

    const handleDelete = () => {
        if (!commissionToDelete) return;

        router.delete(route('employees.commissions.destroy', commissionToDelete.id), {
            onSuccess: () => setCommissionToDelete(null)
        });
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Comissões" />

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center mb-6">
                    <Link href={route('employees.index')}>
                        <Button variant="ghost" className="mr-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-semibold">Comissões</h1>
                </div>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                            <Select
                                value={employeeId}
                                onChange={e => setEmployeeId(e.target.value)}
                                className="w-full"
                            >
                                <option value="">Todos os Funcionários</option>
                                {employees.map(employee => (
                                    <option key={employee.id} value={employee.id}>{employee.name}</option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <Select
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                                className="w-full"
                            >
                                <option value="">Todos os Status</option>
                                <option value="1">Pago</option>
                                <option value="0">Pendente</option>
                            </Select>
                        </div>
                        <div>
                            <Input
                                type="date"
                                placeholder="Data Inicial"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <Input
                                type="date"
                                placeholder="Data Final"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <Button type="submit" className="w-full">
                                <Search className="w-4 h-4 mr-2" />
                                Filtrar
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead onClick={() => handleSort('date')} className="cursor-pointer">
                                    Data
                                    {sortField === 'date' && (
                                        <span className="ml-2">
                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </TableHead>
                                <TableHead>Funcionário</TableHead>
                                <TableHead>Pedido</TableHead>
                                <TableHead onClick={() => handleSort('amount')} className="cursor-pointer">
                                    Valor
                                    {sortField === 'amount' && (
                                        <span className="ml-2">
                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </TableHead>
                                <TableHead>Taxa</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {commissions.data.map(commission => (
                                <TableRow key={commission.id}>
                                    <TableCell>{formatDate(commission.date)}</TableCell>
                                    <TableCell>{commission.employee.name}</TableCell>
                                    <TableCell>#{commission.order.number}</TableCell>
                                    <TableCell>{formatCurrency(commission.amount)}</TableCell>
                                    <TableCell>{commission.rate}%</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded text-sm ${
                                            commission.status
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {commission.status ? 'Pago' : 'Pendente'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Abrir menu</span>
                                                    <svg
                                                        className="h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                    </svg>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setCommissionToDelete(commission)}>
                                                    <Trash className="w-4 h-4 mr-2" />
                                                    Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <AlertDialog open={!!commissionToDelete} onOpenChange={() => setCommissionToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente esta comissão.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AuthenticatedLayout>
    );
}
