import { useEffect } from 'react';

export default function Print({ order, company }) {
    useEffect(() => {
        window.print();
    }, []);

    return (
        <div className="p-4 max-w-[300px] mx-auto text-sm">
            {/* Cabeçalho */}
            <div className="mb-4 text-center">
                <h1 className="text-lg font-bold">{company.name}</h1>
                <p>CNPJ: {company.cnpj}</p>
                <p>{company.address.street}, {company.address.number}</p>
                <p>{company.address.neighborhood} - {company.address.city}/{company.address.state}</p>
                <p>CEP: {company.address.zip}</p>
                <p>Tel: {company.phone}</p>
            </div>

            {/* Informações do Pedido */}
            <div className="py-2 mb-4 border-t border-b border-gray-300">
                <p>Pedido: {order.number}</p>
                <p>Data: {new Date(order.created_at).toLocaleString('pt-BR')}</p>
                <p>Cliente: {order.customer.name}</p>
                <p>Vendedor: {order.user.name}</p>
            </div>

            {/* Itens */}
            <table className="w-full mb-4">
                <thead>
                    <tr className="border-b border-gray-300">
                        <th className="py-1 text-left">Item</th>
                        <th className="py-1 text-right">Qtd</th>
                        <th className="py-1 text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map(item => (
                        <tr key={item.id} className="border-b border-gray-300">
                            <td className="py-1">
                                {item.product.name}
                                {item.variation && (
                                    <span className="block text-xs">
                                        {item.variation.name}
                                    </span>
                                )}
                            </td>
                            <td className="py-1 text-right">{item.quantity}</td>
                            <td className="py-1 text-right">
                                {new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }).format(item.total)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totais */}
            <div className="mb-4">
                <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>
                        {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }).format(order.subtotal)}
                    </span>
                </div>

                {order.discount_value > 0 && (
                    <div className="flex justify-between">
                        <span>
                            Desconto
                            {order.discount_type === 'percentage' ?
                                ` (${order.discount_value}%)` :
                                ''}:
                        </span>
                        <span>
                            {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            }).format(
                                order.discount_type === 'percentage'
                                    ? (order.subtotal * order.discount_value / 100)
                                    : order.discount_value
                            )}
                        </span>
                    </div>
                )}

                <div className="flex justify-between pt-2 mt-2 font-bold border-t border-gray-300">
                    <span>Total:</span>
                    <span>
                        {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }).format(order.total)}
                    </span>
                </div>
            </div>

            {/* Pagamento */}
            <div className="pt-2 mb-4 border-t border-gray-300">
                <p>Forma de Pagamento: {order.payment_method}</p>
                {order.payments.map(payment => (
                    <div key={payment.id} className="flex justify-between">
                        <span>{payment.method}:</span>
                        <span>
                            {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            }).format(payment.amount)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Rodapé */}
            <div className="text-xs text-center">
                <p className="mb-2">
                    {order.notes}
                </p>
                <p>Obrigado pela preferência!</p>
                <p>www.minhaempresa.com.br</p>
            </div>

            {/* Estilos de Impressão */}
            <style>{`
                @media print {
                    @page {
                        margin: 0;
                        size: 80mm 297mm;
                    }
                    body {
                        margin: 0;
                        padding: 10px;
                        width: 80mm;
                    }
                    .no-print {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
}
