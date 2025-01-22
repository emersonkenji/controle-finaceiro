import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import {
    Package,
    ArrowLeft,
    Plus,
    ArrowUp,
    ArrowDown,
    History
} from 'lucide-react';

export default function StockIndex({ product }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        type: 'entrada',
        quantity: '',
        description: '',
        unit_cost: '',
        variation_id: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implementar lógica de envio do formulário
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Gerenciar Estoque" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Link
                                        href={route('products.index')}
                                        className="flex items-center text-gray-600 hover:text-gray-900"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </Link>
                                    <Package className="w-6 h-6 text-gray-600" />
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">
                                            Gerenciar Estoque
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {product.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Link href={route('products.stock.history', product.id)}>
                                        <Button variant="outline">
                                            <History className="w-4 h-4 mr-2" />
                                            Histórico
                                        </Button>
                                    </Link>
                                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Ajustar Estoque
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Ajustar Estoque</DialogTitle>
                                                <DialogDescription>
                                                    Registre uma entrada ou saída de estoque
                                                </DialogDescription>
                                            </DialogHeader>

                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                <div>
                                                    <Label>Tipo de Movimento</Label>
                                                    <Select
                                                        value={formData.type}
                                                        onValueChange={value => setFormData({
                                                            ...formData,
                                                            type: value
                                                        })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="entrada">Entrada</SelectItem>
                                                            <SelectItem value="saida">Saída</SelectItem>
                                                            <SelectItem value="ajuste">Ajuste</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {product.variations?.length > 0 && (
                                                    <div>
                                                        <Label>Variação</Label>
                                                        <Select
                                                            value={formData.variation_id}
                                                            onValueChange={value => setFormData({
                                                                ...formData,
                                                                variation_id: value
                                                            })}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Selecione uma variação" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="">Produto Principal</SelectItem>
                                                                {product.variations.map(variation => (
                                                                    <SelectItem
                                                                        key={variation.id}
                                                                        value={variation.id.toString()}
                                                                    >
                                                                        {variation.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                )}

                                                <div>
                                                    <Label htmlFor="quantity">Quantidade</Label>
                                                    <Input
                                                        id="quantity"
                                                        type="number"
                                                        value={formData.quantity}
                                                        onChange={e => setFormData({
                                                            ...formData,
                                                            quantity: e.target.value
                                                        })}
                                                    />
                                                </div>

                                                {formData.type === 'entrada' && (
                                                    <div>
                                                        <Label htmlFor="unit_cost">Custo Unitário</Label>
                                                        <Input
                                                            id="unit_cost"
                                                            type="number"
                                                            step="0.01"
                                                            value={formData.unit_cost}
                                                            onChange={e => setFormData({
                                                                ...formData,
                                                                unit_cost: e.target.value
                                                            })}
                                                        />
                                                    </div>
                                                )}

                                                <div>
                                                    <Label htmlFor="description">Descrição</Label>
                                                    <Textarea
                                                        id="description"
                                                        value={formData.description}
                                                        onChange={e => setFormData({
                                                            ...formData,
                                                            description: e.target.value
                                                        })}
                                                        rows={3}
                                                    />
                                                </div>

                                                <DialogFooter>
                                                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                                        Cancelar
                                                    </Button>
                                                    <Button type="submit">
                                                        Confirmar
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>

                        {/* Resumo do Estoque */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">Estoque Atual</h3>
                                    <p className="mt-2 text-3xl font-semibold">{product.stock}</p>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Estoque mínimo: {product.min_stock}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">Valor em Estoque</h3>
                                    <p className="mt-2 text-3xl font-semibold">
                                        {formatCurrency(product.stock * product.cost_price)}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Custo médio: {formatCurrency(product.cost_price)}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">Última Movimentação</h3>
                                    {product.stockMovements?.[0] ? (
                                        <>
                                            <p className="mt-2 text-lg font-semibold">
                                                {product.stockMovements[0].type === 'entrada' ? (
                                                    <span className="text-green-600">+{product.stockMovements[0].quantity}</span>
                                                ) : (
                                                    <span className="text-red-600">-{product.stockMovements[0].quantity}</span>
                                                )}
                                            </p>
                                            <p className="mt-1 text-sm text-gray-600">
                                                {formatDate(product.stockMovements[0].created_at)}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="mt-2 text-sm text-gray-600">
                                            Nenhuma movimentação registrada
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tabela de Variações */}
                        {product.variations?.length > 0 && (
                            <div className="p-6">
                                <h3 className="text-lg font-medium mb-4">Estoque por Variação</h3>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Variação</TableHead>
                                            <TableHead>SKU</TableHead>
                                            <TableHead>Estoque</TableHead>
                                            <TableHead>Valor em Estoque</TableHead>
                                            <TableHead>Última Movimentação</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {product.variations.map((variation) => (
                                            <TableRow key={variation.id}>
                                                <TableCell>{variation.name}</TableCell>
                                                <TableCell>{variation.sku}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {variation.stock}
                                                        {variation.stock <= 0 && (
                                                            <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                                                                Sem estoque
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {formatCurrency(variation.stock * variation.cost_price)}
                                                </TableCell>
                                                <TableCell>
                                                    {variation.stockMovements?.[0] ? (
                                                        <div className="flex items-center gap-2">
                                                            {variation.stockMovements[0].type === 'entrada' ? (
                                                                <ArrowUp className="w-4 h-4 text-green-500" />
                                                            ) : (
                                                                <ArrowDown className="w-4 h-4 text-red-500" />
                                                            )}
                                                            <span>
                                                                {variation.stockMovements[0].quantity} un.
                                                            </span>
                                                            <span className="text-gray-500">
                                                                {formatDate(variation.stockMovements[0].created_at)}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500">
                                                            Nenhuma movimentação
                                                        </span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
