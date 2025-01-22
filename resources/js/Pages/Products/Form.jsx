import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    Package,
    ArrowLeft,
    Upload,
    X,
    Plus,
    Trash2,
    Star
} from 'lucide-react';
import { Switch } from '@/Components/ui/switch';
import { Label } from '@/Components/ui/label';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function ProductForm({ product, categories }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: product?.name || '',
        description: product?.description || '',
        category_id: product?.category_id?.toString() || '',
        price: product?.price || '',
        cost_price: product?.cost_price || '',
        stock: product?.stock || '',
        min_stock: product?.min_stock || '',
        status: product?.status || 'active',
        barcode: product?.barcode || '',
        weight: product?.weight || '',
        height: product?.height || '',
        width: product?.width || '',
        length: product?.length || '',
        featured: product?.featured || false,
        attributes: product?.attributes || {},
        images: []
    });

    const [previewImages, setPreviewImages] = useState([]);
    const [existingImages, setExistingImages] = useState(product?.images || []);

    useEffect(() => {
        if (data.images.length > 0) {
            const newPreviews = Array.from(data.images).map(file => ({
                url: URL.createObjectURL(file),
                file
            }));
            setPreviewImages(newPreviews);
        }
    }, [data.images]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (product) {
            put(route('products.update', product.id));
        } else {
            post(route('products.store'));
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setData('images', [...data.images, ...files]);
    };

    const removePreviewImage = (index) => {
        const newImages = [...data.images];
        newImages.splice(index, 1);
        setData('images', newImages);

        const newPreviews = [...previewImages];
        URL.revokeObjectURL(newPreviews[index].url);
        newPreviews.splice(index, 1);
        setPreviewImages(newPreviews);
    };

    const removeExistingImage = (imageId) => {
        post(route('products.images.destroy', imageId), {
            method: 'delete',
            preserveScroll: true,
            onSuccess: () => {
                setExistingImages(existingImages.filter(img => img.id !== imageId));
            }
        });
    };

    const setMainImage = (imageId) => {
        post(route('products.images.main', imageId), {
            method: 'post',
            preserveScroll: true,
            onSuccess: () => {
                setExistingImages(existingImages.map(img => ({
                    ...img,
                    is_main: img.id === imageId
                })));
            }
        });
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(existingImages);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        post(route('products.images.reorder'), {
            data: items.map((image, index) => ({
                id: image.id,
                order: index
            })),
            preserveScroll: true,
            onSuccess: () => {
                setExistingImages(items);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={product ? 'Editar Produto' : 'Novo Produto'} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
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
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        {product ? 'Editar Produto' : 'Novo Produto'}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Formulário */}
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Informações Básicas */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Informações Básicas</h3>

                                    <div>
                                        <Label htmlFor="name">Nome</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            error={errors.name}
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Descrição</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            error={errors.description}
                                            rows={4}
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="category">Categoria</Label>
                                        <Select
                                            value={data.category_id}
                                            onValueChange={value => setData('category_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione uma categoria" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map(category => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={category.id.toString()}
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="barcode">Código de Barras</Label>
                                        <Input
                                            id="barcode"
                                            type="text"
                                            value={data.barcode}
                                            onChange={e => setData('barcode', e.target.value)}
                                            error={errors.barcode}
                                        />
                                        {errors.barcode && (
                                            <p className="mt-1 text-sm text-red-600">{errors.barcode}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Preços e Estoque */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Preços e Estoque</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="price">Preço de Venda</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                value={data.price}
                                                onChange={e => setData('price', e.target.value)}
                                                error={errors.price}
                                            />
                                            {errors.price && (
                                                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="cost_price">Preço de Custo</Label>
                                            <Input
                                                id="cost_price"
                                                type="number"
                                                step="0.01"
                                                value={data.cost_price}
                                                onChange={e => setData('cost_price', e.target.value)}
                                                error={errors.cost_price}
                                            />
                                            {errors.cost_price && (
                                                <p className="mt-1 text-sm text-red-600">{errors.cost_price}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="stock">Estoque</Label>
                                            <Input
                                                id="stock"
                                                type="number"
                                                value={data.stock}
                                                onChange={e => setData('stock', e.target.value)}
                                                error={errors.stock}
                                            />
                                            {errors.stock && (
                                                <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="min_stock">Estoque Mínimo</Label>
                                            <Input
                                                id="min_stock"
                                                type="number"
                                                value={data.min_stock}
                                                onChange={e => setData('min_stock', e.target.value)}
                                                error={errors.min_stock}
                                            />
                                            {errors.min_stock && (
                                                <p className="mt-1 text-sm text-red-600">{errors.min_stock}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Status</Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={value => setData('status', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Ativo</SelectItem>
                                                <SelectItem value="inactive">Inativo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && (
                                            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="featured"
                                            checked={data.featured}
                                            onCheckedChange={checked => setData('featured', checked)}
                                        />
                                        <Label htmlFor="featured">Produto em Destaque</Label>
                                    </div>
                                </div>
                            </div>

                            {/* Dimensões */}
                            <div className="mt-6">
                                <h3 className="mb-4 text-lg font-medium">Dimensões e Peso</h3>
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                    <div>
                                        <Label htmlFor="weight">Peso (kg)</Label>
                                        <Input
                                            id="weight"
                                            type="number"
                                            step="0.01"
                                            value={data.weight}
                                            onChange={e => setData('weight', e.target.value)}
                                            error={errors.weight}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="height">Altura (cm)</Label>
                                        <Input
                                            id="height"
                                            type="number"
                                            step="0.1"
                                            value={data.height}
                                            onChange={e => setData('height', e.target.value)}
                                            error={errors.height}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="width">Largura (cm)</Label>
                                        <Input
                                            id="width"
                                            type="number"
                                            step="0.1"
                                            value={data.width}
                                            onChange={e => setData('width', e.target.value)}
                                            error={errors.width}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="length">Comprimento (cm)</Label>
                                        <Input
                                            id="length"
                                            type="number"
                                            step="0.1"
                                            value={data.length}
                                            onChange={e => setData('length', e.target.value)}
                                            error={errors.length}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Imagens */}
                            <div className="mt-6">
                                <h3 className="mb-4 text-lg font-medium">Imagens</h3>

                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="images" direction="horizontal">
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className="grid grid-cols-2 gap-4 md:grid-cols-4"
                                            >
                                                {existingImages.map((image, index) => (
                                                    <Draggable
                                                        key={image.id}
                                                        draggableId={image.id.toString()}
                                                        index={index}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`relative group ${
                                                                    snapshot.isDragging ? 'z-50' : ''
                                                                }`}
                                                            >
                                                                <img
                                                                    src={`/storage/${image.path}`}
                                                                    alt={image.alt || 'Imagem do produto'}
                                                                    className="object-cover w-full h-40 rounded-lg"
                                                                />
                                                                <div className="absolute inset-0 transition-all duration-200 bg-black bg-opacity-0 rounded-lg group-hover:bg-opacity-40" />
                                                                <div className="absolute flex gap-2 top-2 right-2">
                                                                    {!image.is_main && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setMainImage(image.id)}
                                                                            className="p-1 text-white transition-opacity duration-200 bg-blue-500 rounded-full opacity-0 hover:bg-blue-600 group-hover:opacity-100"
                                                                        >
                                                                            <Star className="w-4 h-4" />
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeExistingImage(image.id)}
                                                                        className="p-1 text-white transition-opacity duration-200 bg-red-500 rounded-full opacity-0 hover:bg-red-600 group-hover:opacity-100"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                                {image.is_main && (
                                                                    <span className="absolute px-2 py-1 text-xs text-white bg-blue-500 rounded-full bottom-2 left-2">
                                                                        Principal
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}

                                                {/* Preview de novas imagens */}
                                                {previewImages.map((preview, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={preview.url}
                                                            alt={`Preview ${index + 1}`}
                                                            className="object-cover w-full h-40 rounded-lg"
                                                        />
                                                        <div className="absolute inset-0 transition-all duration-200 bg-black bg-opacity-0 rounded-lg group-hover:bg-opacity-40" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removePreviewImage(index)}
                                                            className="absolute p-1 text-white transition-opacity duration-200 bg-red-500 rounded-full opacity-0 top-2 right-2 hover:bg-red-600 group-hover:opacity-100"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}

                                                {/* Botão de upload */}
                                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                                        <p className="text-sm text-gray-600">Adicionar imagem</p>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                    />
                                                </label>
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>

                            {/* Botões */}
                            <div className="flex justify-end mt-6 space-x-4">
                                <Link href={route('products.index')}>
                                    <Button variant="outline" type="button">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Salvando...' : (product ? 'Atualizar' : 'Criar')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
