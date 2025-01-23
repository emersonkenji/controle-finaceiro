import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Search, Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu';

export default function Index({ users, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    function handleFilterChange(field, value) {
        window.location.href = route('settings.users.index', {
            ...filters,
            [field]: value
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Usuários" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                                placeholder="Buscar..."
                                value={search}
                                onChange={e => handleFilterChange('search', e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button asChild>
                            <Link href={route('settings.users.create')} className="gap-2">
                                <Plus className="w-4 h-4" />
                                Novo Usuário
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>E-mail</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Último Acesso</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users?.data?.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.email_verified_at ? 'success' : 'warning'}>
                                            {user.email_verified_at ? 'Verificado' : 'Não Verificado'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {user.last_login_at ? format(new Date(user.last_login_at), 'dd/MM/yyyy HH:mm') : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Abrir menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={route('settings.users.edit', user.id)}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        Editar
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        if (confirm('Tem certeza que deseja excluir este usuário?')) {
                                                            window.location.href = route('settings.users.destroy', user.id);
                                                        }
                                                    }}
                                                    className="flex items-center gap-2 text-red-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {users?.data?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4">
                                        Nenhum usuário encontrado
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
