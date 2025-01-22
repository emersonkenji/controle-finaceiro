import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search,
    Plus,
    Filter,
    Package,
    AlertCircle,
    Edit,
    Trash2,
    BarChart2
} from 'lucide-react';

export default function ProductsIndex() {
    const [searchTerm, setSearchTerm] = useState('');

    // Dados de exemplo - posteriormente virão do backend
    const products = [
        {
            id: 1,
            name: 'Notebook Dell Inspiron',
            sku: 'NOT-DELL-001',
            category: 'Eletrônicos',
            price: 3499.99,
            cost: 2800.00,
            stock: 15,
            minStock: 5,
            status: 'active'
        },
        {
            id: 2,
            name: 'Mouse Wireless Logitech',
            sku: 'MOU-LOG-001',
            category: 'Periféricos',
            price: 99.99,
            cost: 45.00,
            stock: 3,
            minStock: 10,
            status: 'low_stock'
        }
    ];

    const getStockStatusColor = (stock, minStock) => {
        if (stock <= 0) return 'bg-red-100 text-red-800';
        if (stock <= minStock) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const calculateProfit = (price, cost) => {
        const profit = ((price - cost) / cost) * 100;
        return profit.toFixed(1) + '%';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Produtos
                    </h2>
                    <Link
                        href={route('products.create')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        Novo Produto
                    </Link>
                </div>
            }
        >
            <Head title="Produtos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Barra de Pesquisa e Filtros */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar produtos..."
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                                    <Filter className="h-5 w-5" />
                                    Filtros
                                </button>
                            </div>
                        </div>

                        {/* Tabela de Produtos */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Produto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Categoria
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Preço
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Lucro
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estoque
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0">
                                                        <Package className="h-10 w-10 text-gray-400" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {product.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            SKU: {product.sku}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {formatCurrency(product.price)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Custo: {formatCurrency(product.cost)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1">
                                                    <BarChart2 className="h-4 w-4 text-green-500" />
                                                    <span className="text-sm font-medium text-green-600">
                                                        {calculateProfit(product.price, product.cost)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        getStockStatusColor(product.stock, product.minStock)
                                                    }`}>
                                                        {product.stock} unidades
                                                    </span>
                                                    {product.stock <= product.minStock && (
                                                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-3">
                                                    <button className="text-indigo-600 hover:text-indigo-900">
                                                        <Edit className="h-5 w-5" />
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-900">
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
