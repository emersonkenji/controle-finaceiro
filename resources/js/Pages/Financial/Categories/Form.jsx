import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

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
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';

export default function Form({ category, parents }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name || '',
        description: category?.description || '',
        type: category?.type || 'both',
        parent_id: category?.parent_id || '',
        order: category?.order || 0,
        active: category?.active ?? true
    });

    function handleSubmit(e) {
        e.preventDefault();

        if (category) {
            put(route('financial.categories.update', category.id));
        } else {
            post(route('financial.categories.store'));
        }
    }

    return (
        <AuthenticatedLayout>
            <Head title={category ? 'Editar Categoria' : 'Nova Categoria'} />

            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="text-2xl font-semibold">
                        {category ? 'Editar Categoria' : 'Nova Categoria'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl">
                    <div className="bg-white rounded-lg shadow p-6 space-y-4">
                        <div>
                            <Label htmlFor="name">Nome</Label>
                            <Input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && (
                                <span className="text-sm text-red-500">{errors.name}</span>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                            />
                            {errors.description && (
                                <span className="text-sm text-red-500">{errors.description}</span>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="type">Tipo</Label>
                            <Select
                                value={data.type}
                                onValueChange={(value) => setData('type', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="receivable">A Receber</SelectItem>
                                    <SelectItem value="payable">A Pagar</SelectItem>
                                    <SelectItem value="both">Ambos</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && (
                                <span className="text-sm text-red-500">{errors.type}</span>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="parent_id">Categoria Pai</Label>
                            <Select
                                value={data.parent_id}
                                onValueChange={(value) => setData('parent_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Nenhuma" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Nenhuma</SelectItem>
                                    {parents.map((parent) => (
                                        <SelectItem key={parent.id} value={parent.id}>
                                            {parent.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.parent_id && (
                                <span className="text-sm text-red-500">{errors.parent_id}</span>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="order">Ordem</Label>
                            <Input
                                type="number"
                                value={data.order}
                                onChange={(e) => setData('order', e.target.value)}
                            />
                            {errors.order && (
                                <span className="text-sm text-red-500">{errors.order}</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Switch
                                checked={data.active}
                                onCheckedChange={(checked) => setData('active', checked)}
                            />
                            <Label>Ativo</Label>
                            {errors.active && (
                                <span className="text-sm text-red-500">{errors.active}</span>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {category ? 'Atualizar' : 'Criar'} Categoria
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
