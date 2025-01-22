import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, FileText, Search, Trash, UserCog } from 'lucide-react';
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

export default function Index({ employees, departments, positions, filters }) {
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [department, setDepartment] = useState(filters.department || '');
    const [position, setPosition] = useState(filters.position || '');
    const [status, setStatus] = useState(filters.status || '');
    const [sortField, setSortField] = useState(filters.sort_field || 'name');
    const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'asc');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('employees.index'), {
            search,
            department,
            position,
            status,
            sort_field: sortField,
            sort_direction: sortDirection
        }, { preserveState: true });
    };

    const handleSort = (field) => {
        const direction = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(direction);
        router.get(route('employees.index'), {
            search,
            department,
            position,
            status,
            sort_field: field,
            sort_direction: direction
        }, { preserveState: true });
    };

    const handleDelete = () => {
        if (!employeeToDelete) return;

        router.delete(route('employees.destroy', employeeToDelete.id), {
            onSuccess: () => setEmployeeToDelete(null)
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
            <Head title="Funcionários" />

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Funcionários</h1>
                    <Link href={route('employees.create')}>
                        <Button>Novo Funcionário</Button>
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Input
                                type="text"
                                placeholder="Buscar..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <Select
                                value={department}
                                onChange={e => setDepartment(e.target.value)}
                                className="w-full"
                            >
                                <option value="">Todos os Departamentos</option>
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <Select
                                value={position}
                                onChange={e => setPosition(e.target.value)}
                                className="w-full"
                            >
                                <option value="">Todos os Cargos</option>
                                {positions.map(pos => (
                                    <option key={pos} value={pos}>{pos}</option>
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
                                <option value="active">Ativo</option>
                                <option value="inactive">Inativo</option>
                            </Select>
                        </div>
                        <div className="md:col-span-4">
                            <Button type="submit" className="w-full md:w-auto">
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
                                <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                                    Nome
                                    {sortField === 'name' && (
                                        <span className="ml-2">
                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </TableHead>
                                <TableHead>Departamento</TableHead>
                                <TableHead>Cargo</TableHead>
                                <TableHead onClick={() => handleSort('hire_date')} className="cursor-pointer">
                                    Data de Admissão
                                    {sortField === 'hire_date' && (
                                        <span className="ml-2">
                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.data.map(employee => (
                                <TableRow key={employee.id}>
                                    <TableCell>{employee.name}</TableCell>
                                    <TableCell>{employee.department}</TableCell>
                                    <TableCell>{employee.position}</TableCell>
                                    <TableCell>{formatDate(employee.hire_date)}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded text-sm ${
                                            employee.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {employee.status === 'active' ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Abrir menu</span>
                                                    <UserCog className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => router.get(route('employees.edit', employee.id))}>
                                                    <UserCog className="w-4 h-4 mr-2" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => router.get(route('employees.history.index', employee.id))}>
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    Histórico
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => router.get(route('employees.performance', employee.id))}>
                                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                                    Desempenho
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setEmployeeToDelete(employee)}>
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

            <AlertDialog open={!!employeeToDelete} onOpenChange={() => setEmployeeToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente o funcionário{' '}
                            {employeeToDelete?.name} e todos os dados associados.
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
