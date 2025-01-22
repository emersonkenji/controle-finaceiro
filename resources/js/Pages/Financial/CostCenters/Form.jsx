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

export default function Form({ costCenter, parents }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: costCenter?.name || '',
        description: costCenter?.description || '',
        code: costCenter?.code || '',
        parent_id: costCenter?.parent_id || '',
        budget: costCenter?.budget || 0,
        active: costCenter?.active ?? true
    });

    function handleSubmit(e) {
        e.preventDefault();

        if (costCenter) {
            put(route('financial.cost-centers.update', costCenter.id));
        } else {
            post(route('financial.cost-centers.store'));
        }
    }

    return (
        <AuthenticatedLayout>
            <Head title={costCenter ? 'Editar Centro de Custo' : 'Novo Centro de Custo'} />

            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="text-2xl font-semibold">
                        {costCenter ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}
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
                            <Label htmlFor="code">Código</Label>
                            <Input
                                type="text"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                            />
                            {errors.code && (
                                <span className="text-sm text-red-500">{errors.code}</span>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="parent_id">Centro de Custo Pai</Label>
                            <Select
                                value={data.parent_id}
                                onValueChange={(value) => setData('parent_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Nenhum" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Nenhum</SelectItem>
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
                            <Label htmlFor="budget">Orçamento</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={data.budget}
                                onChange={(e) => setData('budget', e.target.value)}
                            />
                            {errors.budget && (
                                <span className="text-sm text-red-500">{errors.budget}</span>
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
                                {costCenter ? 'Atualizar' : 'Criar'} Centro de Custo
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
