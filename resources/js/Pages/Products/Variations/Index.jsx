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
    Package,
    ArrowLeft,
    Plus,
    Edit,
    Trash2,
    Box
} from 'lucide-react';

export default function VariationsIndex({ product, variations }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentVariation, setCurrentVariation] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: '',
        cost_price: '',
        stock: '',
        barcode: '',
        attributes: {}
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implementar lógica de envio do formulário
    };

    const handleEdit = (variation) => {
        setCurrentVariation(variation);
        setFormData({
            name: variation.name,
            sku: variation.sku,
            price: variation.price,
            cost_price: variation.cost_price,
            stock: variation.stock,
            barcode: variation.barcode,
            attributes: variation.attributes
        });
        setIsEditing(true);
        setIsOpen(true);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Variações do Produto" />

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
                                            Variações do Produto
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {product.name}
                                        </p>
                                    </div>
                                </div>
                                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                    <DialogTrigger asChild>
                                        <Button onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                name: '',
                                                sku: '',
                                                price: '',
                                                cost_price: '',
                                                stock: '',
                                                barcode: '',
                                                attributes: {}
                                            });
                                        }}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Nova Variação
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                {isEditing ? 'Editar Variação' : 'Nova Variação'}
                                            </DialogTitle>
                                            <DialogDescription>
                                                {isEditing
                                                    ? 'Edite os detalhes da variação do produto'
                                                    : 'Preencha os detalhes da nova variação do produto'}
                                            </DialogDescription>
                                        </DialogHeader>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <Label htmlFor="name">Nome</Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={e => setFormData({
                                                        ...formData,
                                                        name: e.target.value
                                                    })}
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="sku">SKU</Label>
                                                <Input
                                                    id="sku"
                                                    value={formData.sku}
                                                    onChange={e => setFormData({
                                                        ...formData,
                                                        sku: e.target.value
                                                    })}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="price">Preço de Venda</Label>
                                                    <Input
                                                        id="price"
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.price}
                                                        onChange={e => setFormData({
                                                            ...formData,
                                                            price: e.target.value
                                                        })}
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="cost_price">Preço de Custo</Label>
                                                    <Input
                                                        id="cost_price"
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.cost_price}
                                                        onChange={e => setFormData({
                                                            ...formData,
                                                            cost_price: e.target.value
                                                        })}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="stock">Estoque Inicial</Label>
                                                <Input
                                                    id="stock"
                                                    type="number"
                                                    value={formData.stock}
                                                    onChange={e => setFormData({
                                                        ...formData,
                                                        stock: e.target.value
                                                    })}
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="barcode">Código de Barras</Label>
                                                <Input
                                                    id="barcode"
                                                    value={formData.barcode}
                                                    onChange={e => setFormData({
                                                        ...formData,
                                                        barcode: e.target.value
                                                    })}
                                                />
                                            </div>

                                            <DialogFooter>
                                                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                                    Cancelar
                                                </Button>
                                                <Button type="submit">
                                                    {isEditing ? 'Atualizar' : 'Criar'}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        {/* Tabela de Variações */}
                        <div className="p-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Preço</TableHead>
                                        <TableHead>Estoque</TableHead>
                                        <TableHead>Atributos</TableHead>
                                        <TableHead className="w-[100px]">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {variations.map((variation) => (
                                        <TableRow key={variation.id}>
                                            <TableCell>{variation.name}</TableCell>
                                            <TableCell>{variation.sku}</TableCell>
                                            <TableCell>{formatCurrency(variation.price)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Box className={`w-4 h-4 ${
                                                        variation.stock <= 0
                                                            ? 'text-red-500'
                                                            : 'text-green-500'
                                                    }`} />
                                                    <span>{variation.stock}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {Object.entries(variation.attributes).map(([key, value]) => (
                                                    <span
                                                        key={key}
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2"
                                                    >
                                                        {key}: {value}
                                                    </span>
                                                ))}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(variation)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
