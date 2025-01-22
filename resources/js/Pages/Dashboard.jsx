import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { BarChart3, DollarSign, ShoppingCart, Users } from 'lucide-react';

export default function Dashboard() {
    const stats = [
        {
            title: 'Vendas Hoje',
            value: 'R$ 12.450,00',
            icon: DollarSign,
            change: '+12%',
            changeType: 'positive'
        },
        {
            title: 'Novos Clientes',
            value: '120',
            icon: Users,
            change: '+8%',
            changeType: 'positive'
        },
        {
            title: 'Pedidos Pendentes',
            value: '25',
            icon: ShoppingCart,
            change: '-5%',
            changeType: 'negative'
        },
        {
            title: 'Média de Vendas',
            value: 'R$ 450,00',
            icon: BarChart3,
            change: '+2%',
            changeType: 'positive'
        }
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="overflow-hidden rounded-lg bg-white p-6 shadow"
                            >
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <stat.icon className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="truncate text-sm font-medium text-gray-500">
                                                {stat.title}
                                            </dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">
                                                    {stat.value}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className={`text-sm ${
                                        stat.changeType === 'positive'
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }`}>
                                        {stat.change} em relação ao mês anterior
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
