import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { format } from 'date-fns';

export default function Form({ payable, categories, costCenters }) {
    const { data, setData, post, put, processing, errors } = useForm({
        description: payable?.description || '',
        amount: payable?.amount || '',
        due_date: payable?.due_date ? format(new Date(payable.due_date), 'yyyy-MM-dd') : '',
        category_id: payable?.category_id || 'none',
        cost_center_id: payable?.cost_center_id || 'none',
        notes: payable?.notes || '',
    });

    function handleSubmit(e) {
        e.preventDefault();

        if (payable) {
            put(route('financial.payables.update', payable.id));
        } else {
            post(route('financial.payables.store'));
        }
    }

    return (
        <AuthenticatedLayout>
            <Head title={payable ? 'Editar Conta a Pagar' : 'Nova Conta a Pagar'} />

            <div className="p-6">
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="description">Descrição</Label>
                                <Input
                                    id="description"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount">Valor</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    value={data.amount}
                                    onChange={e => setData('amount', e.target.value)}
                                />
                                {errors.amount && (
                                    <p className="text-sm text-red-600">{errors.amount}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="due_date">Data de Vencimento</Label>
                                <Input
                                    id="due_date"
                                    type="date"
                                    value={data.due_date}
                                    onChange={e => setData('due_date', e.target.value)}
                                />
                                {errors.due_date && (
                                    <p className="text-sm text-red-600">{errors.due_date}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category_id">Categoria</Label>
                                <Select
                                    value={data.category_id}
                                    onValueChange={value => setData('category_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Selecione uma categoria</SelectItem>
                                        {categories.map(category => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category_id && (
                                    <p className="text-sm text-red-600">{errors.category_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cost_center_id">Centro de Custo</Label>
                                <Select
                                    value={data.cost_center_id}
                                    onValueChange={value => setData('cost_center_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um centro de custo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Selecione um centro de custo</SelectItem>
                                        {costCenters.map(costCenter => (
                                            <SelectItem key={costCenter.id} value={costCenter.id.toString()}>
                                                {costCenter.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.cost_center_id && (
                                    <p className="text-sm text-red-600">{errors.cost_center_id}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Observações</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                                rows={4}
                            />
                            {errors.notes && (
                                <p className="text-sm text-red-600">{errors.notes}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {payable ? 'Atualizar' : 'Cadastrar'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
