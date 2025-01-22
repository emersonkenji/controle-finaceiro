import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    Package,
    Search,
    ShoppingCart,
    History,
    X,
    Plus,
    Minus,
    Trash2
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';

export default function Pdv({ products, customers, payment_methods, last_orders }) {
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showLastOrders, setShowLastOrders] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        items: [],
        payment_method: '',
        subtotal: 0,
        discount_type: null,
        discount_value: 0,
        total: 0,
        notes: ''
    });

    useEffect(() => {
        setFilteredProducts(
            products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, products]);

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.product_id === product.id);

        if (existingItem) {
            setCart(cart.map(item =>
                item.product_id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, {
                product_id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                total: product.price
            }]);
        }

        updateTotals();
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.product_id !== productId));
        updateTotals();
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        setCart(cart.map(item =>
            item.product_id === productId
                ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
                : item
        ));

        updateTotals();
    };

    const updateTotals = () => {
        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setData(prev => ({
            ...prev,
            items: cart,
            subtotal,
            total: subtotal - (prev.discount_value || 0)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('orders.pdv.store'), {
            onSuccess: () => {
                setCart([]);
                setData({
                    customer_id: '',
                    items: [],
                    payment_method: '',
                    subtotal: 0,
                    discount_type: null,
                    discount_value: 0,
                    total: 0,
                    notes: ''
                });
            }
        });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <AuthenticatedLayout>
            <Head title="PDV" />

            <div className="flex h-[calc(100vh-65px)]">
                {/* Produtos */}
                <div className="flex-1 flex flex-col">
                    <div className="p-4 bg-white border-b">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium">Produtos</h2>
                            <Button
                                variant="outline"
                                onClick={() => setShowLastOrders(true)}
                            >
                                <History className="w-4 h-4 mr-2" />
                                Últimas Vendas
                            </Button>
                        </div>

                        <div className="relative">
                            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                            <Input
                                type="text"
                                placeholder="Buscar produtos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="p-4 transition-shadow bg-white border rounded-lg cursor-pointer hover:shadow-md"
                                >
                                    <div className="flex items-center justify-center mb-4">
                                        {product.images?.[0] ? (
                                            <img
                                                src={`/storage/${product.images[0].path}`}
                                                alt={product.name}
                                                className="object-cover w-20 h-20 rounded-lg"
                                            />
                                        ) : (
                                            <Package className="w-12 h-12 text-gray-400" />
                                        )}
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
                </div>

                {/* Carrinho */}
                <div className="flex flex-col w-96 bg-gray-50 border-l">
                    <div className="p-4 bg-white border-b">
                        <h2 className="mb-4 text-lg font-medium">Carrinho</h2>

                        <div className="space-y-4">
                            <div>
                                <Label>Cliente</Label>
                                <Select
                                    value={data.customer_id || "no-customer"}
                                    onValueChange={(value) => setData('customer_id', value === "no-customer" ? "" : value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um cliente" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="no-customer">Selecione um cliente</SelectItem>
                                        {customers.map(customer => (
                                            <SelectItem key={customer.id} value={customer.id.toString()}>
                                                {customer.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.customer_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.customer_id}</p>
                                )}
                            </div>

                            <div>
                                <Label>Forma de Pagamento</Label>
                                <Select
                                    value={data.payment_method || "no-payment"}
                                    onValueChange={(value) => setData('payment_method', value === "no-payment" ? "" : value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma forma de pagamento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="no-payment">Selecione uma forma de pagamento</SelectItem>
                                        {payment_methods.map(method => (
                                            <SelectItem key={method.id} value={method.id.toString()}>
                                                {method.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.payment_method && (
                                    <p className="mt-1 text-sm text-red-600">{errors.payment_method}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <ShoppingCart className="w-12 h-12 mb-2" />
                                <p>Carrinho vazio</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item.product_id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                                        <div className="flex-1">
                                            <h4 className="font-medium">{item.name}</h4>
                                            <p className="text-sm text-gray-500">
                                                {formatCurrency(item.price)} un
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </Button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeFromCart(item.product_id)}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-white border-t">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-medium">{formatCurrency(data.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Desconto:</span>
                                <span className="font-medium">{formatCurrency(data.discount_value || 0)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-semibold">
                                <span>Total:</span>
                                <span>{formatCurrency(data.total)}</span>
                            </div>
                        </div>

                        <Button
                            className="w-full mt-4"
                            onClick={handleSubmit}
                            disabled={processing || cart.length === 0}
                        >
                            {processing ? 'Finalizando...' : 'Finalizar Venda'}
                        </Button>
                    </div>
                </div>
            </div>

            <Dialog open={showLastOrders} onOpenChange={setShowLastOrders}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Últimas Vendas</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {last_orders.map((order) => (
                            <div key={order.id} className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">Pedido #{order.id}</span>
                                    <span className="text-gray-500">{order.created_at}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>{order.customer.name}</span>
                                    <span className="font-medium">{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
