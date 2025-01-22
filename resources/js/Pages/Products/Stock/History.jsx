import { Head, Link } from '@inertiajs/react';
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
import {
    Package,
    ArrowLeft,
    ArrowUp,
    ArrowDown,
    Box
} from 'lucide-react';
import Pagination from '@/Components/Pagination';

export default function StockHistory({ product, movements }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getMovementIcon = (type) => {
        switch (type) {
            case 'entrada':
                return <ArrowUp className="w-4 h-4 text-green-500" />;
            case 'saida':
                return <ArrowDown className="w-4 h-4 text-red-500" />;
            default:
                return <Box className="w-4 h-4 text-blue-500" />;
        }
    };

    const getMovementText = (type) => {
        switch (type) {
            case 'entrada':
                return 'Entrada';
            case 'saida':
                return 'Saída';
            case 'ajuste':
                return 'Ajuste';
            default:
                return type;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Histórico de Estoque" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Link
                                        href={route('products.stock.index', product.id)}
                                        className="flex items-center text-gray-600 hover:text-gray-900"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </Link>
                                    <Package className="w-6 h-6 text-gray-600" />
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">
                                            Histórico de Estoque
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {product.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabela de Movimentações */}
                        <div className="p-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Quantidade</TableHead>
                                        <TableHead>Variação</TableHead>
                                        <TableHead>Custo Unitário</TableHead>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead>Usuário</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {movements.data.map((movement) => (
                                        <TableRow key={movement.id}>
                                            <TableCell>
                                                {formatDate(movement.created_at)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getMovementIcon(movement.type)}
                                                    <span className={`text-sm font-medium ${
                                                        movement.type === 'entrada'
                                                            ? 'text-green-600'
                                                            : movement.type === 'saida'
                                                                ? 'text-red-600'
                                                                : 'text-blue-600'
                                                    }`}>
                                                        {getMovementText(movement.type)}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium">
                                                    {movement.type === 'entrada' ? '+' : '-'}
                                                    {movement.quantity}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {movement.variation ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {movement.variation.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500">
                                                        Produto Principal
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {movement.unit_cost ? (
                                                    formatCurrency(movement.unit_cost)
                                                ) : (
                                                    <span className="text-gray-500">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-sm text-gray-600">
                                                    {movement.description}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-gray-600">
                                                    {movement.user?.name || 'Sistema'}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Paginação */}
                            {movements.links && (
                                <div className="mt-4">
                                    <Pagination links={movements} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
