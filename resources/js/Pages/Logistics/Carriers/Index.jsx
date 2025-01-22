import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Badge } from '@/Components/ui/badge';
import {
    Search,
    Plus,
    ArrowUpDown,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';

export default function Index({ carriers, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || 'all');

    function handleFilterChange(field, value) {
        window.location.href = route('logistics.carriers.index', {
            ...filters,
            [field]: value
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Transportadoras" />

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

                        <Select
                            value={status}
                            onValueChange={value => handleFilterChange('status', value)}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="active">Ativos</SelectItem>
                                <SelectItem value="inactive">Inativos</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button asChild>
                            <Link href={route('logistics.carriers.create')} className="gap-2">
                                <Plus className="w-4 h-4" />
                                Nova Transportadora
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Documento</TableHead>
                                <TableHead>Contato</TableHead>
                                <TableHead>Cidade/UF</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Entregas</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {carriers?.data?.map(carrier => (
                                <TableRow key={carrier.id}>
                                    <TableCell>{carrier.name}</TableCell>
                                    <TableCell>{carrier.document}</TableCell>
                                    <TableCell>
                                        <div>
                                            <p>{carrier.contact_name}</p>
                                            <p className="text-sm text-gray-500">{carrier.contact_phone}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{carrier.city}/{carrier.state}</TableCell>
                                    <TableCell>
                                        <Badge variant={carrier.status === 'active' ? 'success' : 'secondary'}>
                                            {carrier.status === 'active' ? 'Ativo' : 'Inativo'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{carrier.deliveries_count}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={route('logistics.carriers.show', carrier.id)}
                                                        className="flex items-center"
                                                    >
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Visualizar
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={route('logistics.carriers.edit', carrier.id)}
                                                        className="flex items-center"
                                                    >
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Editar
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        if (confirm('Tem certeza que deseja excluir esta transportadora?')) {
                                                            router.delete(route('logistics.carriers.destroy', carrier.id));
                                                        }
                                                    }}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {(!carriers?.data || carriers.data.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        Nenhuma transportadora encontrada
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
