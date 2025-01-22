import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { Search, Plus, Trash2, Package } from 'lucide-react';

export default function Create({ customers, products }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [cart, setCart] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        items: [],
        payment_method: '',
        subtotal: 0,
        discount_type: null,
        discount_value: 0,
        shipping_cost: 0,
        total: 0,
        notes: '',
        delivery_address: null
    });

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
        let total = subtotal;

        if (data.discount_type === 'percentage') {
            total -= (total * data.discount_value) / 100;
        } else if (data.discount_type === 'fixed') {
            total -= data.discount_value;
        }

        total += parseFloat(data.shipping_cost || 0);

        setData(prev => ({
            ...prev,
            items: cart.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.price,
                total: item.total
            })),
            subtotal,
            total
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('orders.store'));
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Nova Venda" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold">Nova Venda</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="customer_id">Cliente</Label>
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
                                        <Label htmlFor="payment_method">Forma de Pagamento</Label>
                                        <Select
                                            value={data.payment_method || "no-method"}
                                            onValueChange={(value) => setData('payment_method', value === "no-method" ? "" : value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione a forma de pagamento" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="no-method">Selecione a forma de pagamento</SelectItem>
                                                <SelectItem value="money">Dinheiro</SelectItem>
                                                <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                                                <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                                                <SelectItem value="pix">PIX</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.payment_method && (
                                            <p className="mt-1 text-sm text-red-600">{errors.payment_method}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-6">
                                    <div>
                                        <Label htmlFor="discount_type">Tipo de Desconto</Label>
                                        <Select
                                            value={data.discount_type || "no-discount"}
                                            onValueChange={(value) => {
                                                setData('discount_type', value === "no-discount" ? null : value);
                                                updateTotals();
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tipo de desconto" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="no-discount">Sem desconto</SelectItem>
                                                <SelectItem value="percentage">Porcentagem</SelectItem>
                                                <SelectItem value="fixed">Valor Fixo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="discount_value">Valor do Desconto</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.discount_value}
                                            onChange={(e) => {
                                                setData('discount_value', e.target.value);
                                                updateTotals();
                                            }}
                                            disabled={!data.discount_type}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="shipping_cost">Frete</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.shipping_cost}
                                            onChange={(e) => {
                                                setData('shipping_cost', e.target.value);
                                                updateTotals();
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="notes">Observações</Label>
                                    <Textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <div className="mb-4">
                                            <Label>Produtos</Label>
                                            <div className="relative">
                                                <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                                <Input
                                                    type="text"
                                                    placeholder="Buscar produtos..."
                                                    value={searchTerm}
                                                    onChange={(e) => {
                                                        setSearchTerm(e.target.value);
                                                        setFilteredProducts(
                                                            products.filter(product =>
                                                                product.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                                                                product.sku.toLowerCase().includes(e.target.value.toLowerCase())
                                                            )
                                                        );
                                                    }}
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
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

                                    <div>
                                        <Label>Carrinho</Label>
                                        <div className="p-4 border rounded-lg">
                                            {cart.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                                    <Package className="w-12 h-12 mb-2" />
                                                    <p>Carrinho vazio</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {cart.map((item) => (
                                                        <div key={item.product_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <div className="flex-1">
                                                                <h4 className="font-medium">{item.name}</h4>
                                                                <p className="text-sm text-gray-500">
                                                                    {formatCurrency(item.price)} un
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center space-x-4">
                                                                <Input
                                                                    type="number"
                                                                    min="1"
                                                                    value={item.quantity}
                                                                    onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value))}
                                                                    className="w-20"
                                                                />
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

                                                    <div className="pt-4 mt-4 space-y-2 border-t">
                                                        <div className="flex justify-between text-sm">
                                                            <span>Subtotal:</span>
                                                            <span>{formatCurrency(data.subtotal)}</span>
                                                        </div>
                                                        {data.discount_type && (
                                                            <div className="flex justify-between text-sm text-red-600">
                                                                <span>Desconto:</span>
                                                                <span>
                                                                    {data.discount_type === 'percentage'
                                                                        ? `${data.discount_value}%`
                                                                        : formatCurrency(data.discount_value)}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {data.shipping_cost > 0 && (
                                                            <div className="flex justify-between text-sm">
                                                                <span>Frete:</span>
                                                                <span>{formatCurrency(data.shipping_cost)}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between pt-2 text-lg font-semibold border-t">
                                                            <span>Total:</span>
                                                            <span>{formatCurrency(data.total)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={processing || cart.length === 0}
                                    >
                                        Finalizar Venda
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
