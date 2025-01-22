import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
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
import { Badge } from '@/Components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Show({ order }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'warning',
            processing: 'info',
            completed: 'success',
            cancelled: 'destructive'
        };

        const labels = {
            pending: 'Pendente',
            processing: 'Em Processamento',
            completed: 'Concluído',
            cancelled: 'Cancelado'
        };

        return (
            <Badge variant={variants[status]}>
                {labels[status]}
            </Badge>
        );
    };

    const getPaymentStatusBadge = (status) => {
        const variants = {
            pending: 'warning',
            partial: 'info',
            paid: 'success'
        };

        const labels = {
            pending: 'Pendente',
            partial: 'Parcial',
            paid: 'Pago'
        };

        return (
            <Badge variant={variants[status]}>
                {labels[status]}
            </Badge>
        );
    };

    const handleCancel = () => {
        if (confirm('Tem certeza que deseja cancelar esta venda?')) {
            router.post(route('orders.cancel', order.id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Venda #${order.number}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold">Venda #{order.number}</h2>
                                <div className="flex items-center space-x-4">
                                    {order.status !== 'cancelled' && (
                                        <Button
                                            variant="destructive"
                                            onClick={handleCancel}
                                        >
                                            Cancelar Venda
                                        </Button>
                                    )}
                                    <Button asChild>
                                        <a href={route('orders.print', order.id)} target="_blank">
                                            Imprimir
                                        </a>
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="mb-4 text-lg font-medium">Informações da Venda</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="font-medium">Data:</span>{' '}
                                            {format(new Date(order.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                        </div>
                                        <div>
                                            <span className="font-medium">Status:</span>{' '}
                                            {getStatusBadge(order.status)}
                                        </div>
                                        <div>
                                            <span className="font-medium">Status do Pagamento:</span>{' '}
                                            {getPaymentStatusBadge(order.payment_status)}
                                        </div>
                                        <div>
                                            <span className="font-medium">Forma de Pagamento:</span>{' '}
                                            {order.payment_method}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-4 text-lg font-medium">Informações do Cliente</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="font-medium">Nome:</span>{' '}
                                            {order.customer.name}
                                        </div>
                                        <div>
                                            <span className="font-medium">Email:</span>{' '}
                                            {order.customer.email}
                                        </div>
                                        <div>
                                            <span className="font-medium">Telefone:</span>{' '}
                                            {order.customer.phone}
                                        </div>
                                        {order.delivery_address && (
                                            <div>
                                                <span className="font-medium">Endereço de Entrega:</span>{' '}
                                                {order.delivery_address.street}, {order.delivery_address.number}{' '}
                                                {order.delivery_address.complement && `- ${order.delivery_address.complement}`}{' '}
                                                {order.delivery_address.neighborhood} - {order.delivery_address.city}/{order.delivery_address.state}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="mb-4 text-lg font-medium">Itens do Pedido</h3>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Produto</TableHead>
                                            <TableHead>Quantidade</TableHead>
                                            <TableHead>Preço Unitário</TableHead>
                                            <TableHead>Desconto</TableHead>
                                            <TableHead>Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    {item.product.name}
                                                    {item.variation && (
                                                        <span className="block text-sm text-gray-500">
                                                            Variação: {item.variation.name}
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                                                <TableCell>
                                                    {item.discount_type === 'percentage'
                                                        ? `${item.discount_value}%`
                                                        : item.discount_type === 'fixed'
                                                            ? formatCurrency(item.discount_value)
                                                            : '-'}
                                                </TableCell>
                                                <TableCell>{formatCurrency(item.total)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <div className="flex justify-end mt-4">
                                    <div className="w-64 space-y-2">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span>{formatCurrency(order.subtotal)}</span>
                                        </div>
                                        {order.discount_type && (
                                            <div className="flex justify-between text-red-600">
                                                <span>Desconto:</span>
                                                <span>
                                                    {order.discount_type === 'percentage'
                                                        ? `${order.discount_value}%`
                                                        : formatCurrency(order.discount_value)}
                                                </span>
                                            </div>
                                        )}
                                        {order.shipping_cost > 0 && (
                                            <div className="flex justify-between">
                                                <span>Frete:</span>
                                                <span>{formatCurrency(order.shipping_cost)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between pt-2 text-lg font-semibold border-t">
                                            <span>Total:</span>
                                            <span>{formatCurrency(order.total)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {order.notes && (
                                <div>
                                    <h3 className="mb-2 text-lg font-medium">Observações</h3>
                                    <p className="text-gray-600">{order.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
