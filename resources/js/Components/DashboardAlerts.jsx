import { AlertTriangle, Package, TruckIcon, ClockIcon } from 'lucide-react';

export default function DashboardAlerts({ alerts }) {
    return (
        <div className="p-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <h3 className="mb-6 text-lg font-medium text-gray-900">Alertas do Sistema</h3>
            <div className="space-y-4">
                {alerts.lowStock.length > 0 && (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50">
                        <Package className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-yellow-800">Estoque Baixo</h4>
                            <p className="mt-1 text-sm text-yellow-700">
                                {alerts.lowStock.length} produtos precisam de reposição
                            </p>
                            <ul className="mt-2 text-sm text-yellow-600">
                                {alerts.lowStock.slice(0, 3).map(product => (
                                    <li key={product.id}>{product.name} - {product.stock} unidades</li>
                                ))}
                                {alerts.lowStock.length > 3 && (
                                    <li className="text-yellow-500">+ {alerts.lowStock.length - 3} outros produtos</li>
                                )}
                            </ul>
                        </div>
                    </div>
                )}

                {alerts.pendingOrders.length > 0 && (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50">
                        <ClockIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-blue-800">Pedidos Pendentes</h4>
                            <p className="mt-1 text-sm text-blue-700">
                                {alerts.pendingOrders.length} pedidos aguardando processamento
                            </p>
                            <ul className="mt-2 text-sm text-blue-600">
                                {alerts.pendingOrders.slice(0, 3).map(order => (
                                    <li key={order.id}>Pedido #{order.number} - R$ {order.total}</li>
                                ))}
                                {alerts.pendingOrders.length > 3 && (
                                    <li className="text-blue-500">+ {alerts.pendingOrders.length - 3} outros pedidos</li>
                                )}
                            </ul>
                        </div>
                    </div>
                )}

                {alerts.deliveries.length > 0 && (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50">
                        <TruckIcon className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-green-800">Entregas em Andamento</h4>
                            <p className="mt-1 text-sm text-green-700">
                                {alerts.deliveries.length} entregas em progresso
                            </p>
                            <ul className="mt-2 text-sm text-green-600">
                                {alerts.deliveries.slice(0, 3).map(delivery => (
                                    <li key={delivery.id}>
                                        Entrega #{delivery.id} - {delivery.status}
                                    </li>
                                ))}
                                {alerts.deliveries.length > 3 && (
                                    <li className="text-green-500">+ {alerts.deliveries.length - 3} outras entregas</li>
                                )}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

