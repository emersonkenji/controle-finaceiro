import { useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Print({ order }) {
    useEffect(() => {
        window.print();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <div className="p-8 bg-white">
            <div className="mb-8 text-center">
                <h1 className="mb-2 text-2xl font-bold">COMPROVANTE DE VENDA</h1>
                <p className="text-lg">Pedido #{order.number}</p>
                <p className="text-sm text-gray-600">
                    {format(new Date(order.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <h2 className="mb-2 text-lg font-semibold">Informações do Cliente</h2>
                    <div className="space-y-1">
                        <p><strong>Nome:</strong> {order.customer.name}</p>
                        <p><strong>Email:</strong> {order.customer.email}</p>
                        <p><strong>Telefone:</strong> {order.customer.phone}</p>
                        {order.delivery_address && (
                            <div>
                                <p><strong>Endereço de Entrega:</strong></p>
                                <p>
                                    {order.delivery_address.street}, {order.delivery_address.number}{' '}
                                    {order.delivery_address.complement && `- ${order.delivery_address.complement}`}
                                </p>
                                <p>
                                    {order.delivery_address.neighborhood} - {order.delivery_address.city}/{order.delivery_address.state}
                                </p>
                                <p>CEP: {order.delivery_address.zip_code}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="mb-2 text-lg font-semibold">Informações do Pedido</h2>
                    <div className="space-y-1">
                        <p><strong>Status:</strong> {order.status}</p>
                        <p><strong>Status do Pagamento:</strong> {order.payment_status}</p>
                        <p><strong>Forma de Pagamento:</strong> {order.payment_method}</p>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="mb-4 text-lg font-semibold">Itens do Pedido</h2>
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2 text-left">Produto</th>
                            <th className="py-2 text-center">Quantidade</th>
                            <th className="py-2 text-right">Preço Unit.</th>
                            <th className="py-2 text-right">Desconto</th>
                            <th className="py-2 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item) => (
                            <tr key={item.id} className="border-b">
                                <td className="py-2">
                                    {item.product.name}
                                    {item.variation && (
                                        <span className="block text-sm text-gray-600">
                                            Variação: {item.variation.name}
                                        </span>
                                    )}
                                </td>
                                <td className="py-2 text-center">{item.quantity}</td>
                                <td className="py-2 text-right">{formatCurrency(item.unit_price)}</td>
                                <td className="py-2 text-right">
                                    {item.discount_type === 'percentage'
                                        ? `${item.discount_value}%`
                                        : item.discount_type === 'fixed'
                                            ? formatCurrency(item.discount_value)
                                            : '-'}
                                </td>
                                <td className="py-2 text-right">{formatCurrency(item.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end">
                <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    {order.discount_type && (
                        <div className="flex justify-between">
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
                    <div className="flex justify-between pt-2 font-semibold border-t">
                        <span>Total:</span>
                        <span>{formatCurrency(order.total)}</span>
                    </div>
                </div>
            </div>

            {order.notes && (
                <div className="mt-8">
                    <h2 className="mb-2 text-lg font-semibold">Observações</h2>
                    <p className="text-gray-600">{order.notes}</p>
                </div>
            )}

            <style>{`
                @media print {
                    @page {
                        margin: 20mm;
                    }
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                }
            `}</style>
        </div>
    );
}
