import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(date) {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
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

export const columns = [
    {
        accessorKey: 'description',
        header: 'Descrição',
        cell: ({ row }) => <div className="font-medium">{row.original.description}</div>
    },
    {
        accessorKey: 'amount',
        header: 'Valor',
        cell: ({ row }) => formatCurrency(row.original.amount)
    },
    {
        accessorKey: 'due_date',
        header: 'Vencimento',
        cell: ({ row }) => formatDate(row.original.due_date)
    },
    {
        accessorKey: 'category',
        header: 'Categoria',
        cell: ({ row }) => row.original.category?.name || '-'
    },
    {
        accessorKey: 'cost_center',
        header: 'Centro de Custo',
        cell: ({ row }) => row.original.cost_center?.name || '-'
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <Badge variant={statusColors[row.original.status]}>
                {statusLabels[row.original.status]}
            </Badge>
        )
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const payable = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={route('financial.payables.show', payable.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>Visualizar</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={route('financial.payables.edit', payable.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Editar</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                if (confirm('Tem certeza que deseja excluir esta conta?')) {
                                    router.delete(route('financial.payables.destroy', payable.id));
                                }
                            }}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Excluir</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];
