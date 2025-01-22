import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Truck, Package, MapPin, Calendar } from 'lucide-react';

export default function Index({ deliveries }) {
    function formatDate(date) {
        return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
    }

    const statusColors = {
        pending: 'yellow',
        in_transit: 'blue',
        delivered: 'green',
        cancelled: 'red'
    };

    const statusLabels = {
        pending: 'Pendente',
        in_transit: 'Em Trânsito',
        delivered: 'Entregue',
        cancelled: 'Cancelado'
    };

    return (
        <AuthenticatedLayout>
            <Head title="Rastreamento" />

            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Entregas em Andamento</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {deliveries.map(delivery => (
                        <Card key={delivery.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Pedido #{delivery.order.number}</span>
                                    <Badge variant={statusColors[delivery.status]}>
                                        {statusLabels[delivery.status]}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-gray-500" />
                                        <span>{delivery.carrier.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4 text-gray-500" />
                                        <span>{delivery.tracking_code}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <span>{delivery.order.shipping_address}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span>Previsão: {formatDate(delivery.estimated_delivery)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {deliveries.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            <Truck className="w-12 h-12 mx-auto mb-4" />
                            <p>Nenhuma entrega em andamento</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
