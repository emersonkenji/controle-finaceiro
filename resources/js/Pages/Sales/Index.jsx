import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search,
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    CreditCard,
    Banknote,
    Wallet,
    Receipt,
    User,
    Package
} from 'lucide-react';
import PaymentModal from '@/Components/PaymentModal';

export default function SalesIndex() {
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Dados de exemplo - posteriormente virão do backend
    const products = [
        {
            id: 1,
            name: 'Notebook Dell Inspiron',
            price: 3499.99,
            stock: 15,
            sku: 'NOT-DELL-001'
        },
        {
            id: 2,
            name: 'Mouse Wireless Logitech',
            price: 99.99,
            stock: 3,
            sku: 'MOU-LOG-001'
        }
    ];

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        setCart(cart.map(item =>
            item.id === productId
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const handlePaymentConfirm = (paymentDetails) => {
        console.log('Detalhes do pagamento:', paymentDetails);
        // Aqui você implementará a lógica de finalização da venda
        setShowPaymentModal(false);
        setCart([]);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        PDV - Nova Venda
                    </h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSelectedCustomer(null)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
                        >
                            <User className="h-5 w-5 text-gray-500" />
                            {selectedCustomer ? selectedCustomer.name : 'Selecionar Cliente'}
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                            <Receipt className="h-5 w-5 text-gray-500" />
                            Vendas do Dia
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="PDV" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex gap-6">
                        {/* Lista de Produtos */}
                        <div className="flex-1 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar produtos por nome ou código..."
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => addToCart(product)}
                                        className="p-4 border rounded-lg hover:shadow-md cursor-pointer transition-shadow"
                                    >
                                        <div className="flex justify-center mb-4">
                                            <Package className="h-12 w-12 text-gray-400" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                {product.name}
                                            </h3>
                                            <p className="mt-1 text-lg font-semibold text-green-600">
                                                {formatCurrency(product.price)}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Estoque: {product.stock} un
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Carrinho */}
                        <div className="w-96 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center gap-2 text-lg font-medium text-gray-900">
                                    <ShoppingCart className="h-5 w-5" />
                                    Carrinho
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-gray-900">
                                                {item.name}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                {formatCurrency(item.price)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1 rounded-full hover:bg-gray-100"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1 rounded-full hover:bg-gray-100"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-1 text-red-600 rounded-full hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {cart.length === 0 && (
                                    <div className="text-center text-gray-500 py-8">
                                        Carrinho vazio
                                    </div>
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="p-6 bg-gray-50 mt-auto">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg font-medium text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-green-600">
                                            {formatCurrency(calculateTotal())}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        <button className="flex flex-col items-center justify-center p-3 border rounded-lg hover:bg-gray-50">
                                            <CreditCard className="h-6 w-6 text-blue-600" />
                                            <span className="text-xs mt-1">Cartão</span>
                                        </button>
                                        <button className="flex flex-col items-center justify-center p-3 border rounded-lg hover:bg-gray-50">
                                            <Banknote className="h-6 w-6 text-green-600" />
                                            <span className="text-xs mt-1">Dinheiro</span>
                                        </button>
                                        <button className="flex flex-col items-center justify-center p-3 border rounded-lg hover:bg-gray-50">
                                            <Wallet className="h-6 w-6 text-purple-600" />
                                            <span className="text-xs mt-1">Pix</span>
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => setShowPaymentModal(true)}
                                        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                                    >
                                        Finalizar Venda
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                total={calculateTotal()}
                onConfirm={handlePaymentConfirm}
            />
        </AuthenticatedLayout>
    );
}
