import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Upload, X } from 'lucide-react';

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
import { Badge } from '@/Components/ui/badge';

export default function Form({ transaction, categories, costCenters }) {
    const { data, setData, post, put, processing, errors } = useForm({
        type: transaction?.type || 'receivable',
        description: transaction?.description || '',
        amount: transaction?.amount || '',
        due_date: transaction?.due_date ? format(new Date(transaction.due_date), 'yyyy-MM-dd') : '',
        payment_date: transaction?.payment_date ? format(new Date(transaction.payment_date), 'yyyy-MM-dd') : '',
        status: transaction?.status || 'pending',
        payment_method: transaction?.payment_method || '',
        category_id: transaction?.category_id || '',
        cost_center_id: transaction?.cost_center_id || '',
        notes: transaction?.notes || '',
        document_number: transaction?.document_number || '',
        installment_number: transaction?.installment_number || '',
        total_installments: transaction?.total_installments || '',
        attachments: []
    });

    const [attachmentPreviews, setAttachmentPreviews] = useState([]);

    function handleSubmit(e) {
        e.preventDefault();

        if (transaction) {
            put(route('financial.transactions.update', transaction.id));
        } else {
            post(route('financial.transactions.store'));
        }
    }

    function handleAttachmentChange(e) {
        const files = Array.from(e.target.files);
        setData('attachments', [...data.attachments, ...files]);

        const previews = files.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type
        }));
        setAttachmentPreviews([...attachmentPreviews, ...previews]);
    }

    function removeAttachment(index) {
        const newAttachments = [...data.attachments];
        newAttachments.splice(index, 1);
        setData('attachments', newAttachments);

        const newPreviews = [...attachmentPreviews];
        newPreviews.splice(index, 1);
        setAttachmentPreviews(newPreviews);
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    return (
        <AuthenticatedLayout>
            <Head title={transaction ? 'Editar Transação' : 'Nova Transação'} />

            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="text-2xl font-semibold">
                        {transaction ? 'Editar Transação' : 'Nova Transação'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="max-w-3xl">
                    <div className="bg-white rounded-lg shadow p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
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
                                    </SelectContent>
                                </Select>
                                {errors.type && (
                                    <span className="text-sm text-red-500">{errors.type}</span>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) => setData('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pendente</SelectItem>
                                        <SelectItem value="paid">Pago</SelectItem>
                                        <SelectItem value="cancelled">Cancelado</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <span className="text-sm text-red-500">{errors.status}</span>
                                )}
                            </div>

                            <div className="col-span-2">
                                <Label htmlFor="description">Descrição</Label>
                                <Input
                                    type="text"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                {errors.description && (
                                    <span className="text-sm text-red-500">{errors.description}</span>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="amount">Valor</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                />
                                {errors.amount && (
                                    <span className="text-sm text-red-500">{errors.amount}</span>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="due_date">Data de Vencimento</Label>
                                <Input
                                    type="date"
                                    value={data.due_date}
                                    onChange={(e) => setData('due_date', e.target.value)}
                                />
                                {errors.due_date && (
                                    <span className="text-sm text-red-500">{errors.due_date}</span>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="payment_date">Data de Pagamento</Label>
                                <Input
                                    type="date"
                                    value={data.payment_date}
                                    onChange={(e) => setData('payment_date', e.target.value)}
                                />
                                {errors.payment_date && (
                                    <span className="text-sm text-red-500">{errors.payment_date}</span>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="payment_method">Forma de Pagamento</Label>
                                <Input
                                    type="text"
                                    value={data.payment_method}
                                    onChange={(e) => setData('payment_method', e.target.value)}
                                />
                                {errors.payment_method && (
                                    <span className="text-sm text-red-500">{errors.payment_method}</span>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="category_id">Categoria</Label>
                                <Select
                                    value={data.category_id}
                                    onValueChange={(value) => setData('category_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category_id && (
                                    <span className="text-sm text-red-500">{errors.category_id}</span>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="cost_center_id">Centro de Custo</Label>
                                <Select
                                    value={data.cost_center_id}
                                    onValueChange={(value) => setData('cost_center_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Nenhum</SelectItem>
                                        {costCenters.map((costCenter) => (
                                            <SelectItem key={costCenter.id} value={costCenter.id}>
                                                {costCenter.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.cost_center_id && (
                                    <span className="text-sm text-red-500">{errors.cost_center_id}</span>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="document_number">Número do Documento</Label>
                                <Input
                                    type="text"
                                    value={data.document_number}
                                    onChange={(e) => setData('document_number', e.target.value)}
                                />
                                {errors.document_number && (
                                    <span className="text-sm text-red-500">{errors.document_number}</span>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="installment_number">Número da Parcela</Label>
                                <Input
                                    type="number"
                                    value={data.installment_number}
                                    onChange={(e) => setData('installment_number', e.target.value)}
                                />
                                {errors.installment_number && (
                                    <span className="text-sm text-red-500">{errors.installment_number}</span>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="total_installments">Total de Parcelas</Label>
                                <Input
                                    type="number"
                                    value={data.total_installments}
                                    onChange={(e) => setData('total_installments', e.target.value)}
                                />
                                {errors.total_installments && (
                                    <span className="text-sm text-red-500">{errors.total_installments}</span>
                                )}
                            </div>

                            <div className="col-span-2">
                                <Label htmlFor="notes">Observações</Label>
                                <Textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={3}
                                />
                                {errors.notes && (
                                    <span className="text-sm text-red-500">{errors.notes}</span>
                                )}
                            </div>

                            <div className="col-span-2">
                                <Label>Anexos</Label>
                                <div className="mt-2">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => document.getElementById('attachments').click()}
                                            className="gap-2"
                                        >
                                            <Upload className="w-4 h-4" />
                                            Adicionar Anexos
                                        </Button>
                                        <Input
                                            id="attachments"
                                            type="file"
                                            multiple
                                            className="hidden"
                                            onChange={handleAttachmentChange}
                                        />
                                    </div>

                                    {attachmentPreviews.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {attachmentPreviews.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium">{file.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatFileSize(file.size)}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeAttachment(index)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {transaction?.attachments?.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            <h3 className="text-sm font-medium">Anexos Existentes</h3>
                                            {transaction.attachments.map((attachment) => (
                                                <div
                                                    key={attachment.id}
                                                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium">{attachment.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {attachment.size_for_humans}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={route('financial.attachments.download', attachment.id)}
                                                                target="_blank"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => router.delete(
                                                                route('financial.attachments.destroy', attachment.id)
                                                            )}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
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
                                {transaction ? 'Atualizar' : 'Criar'} Transação
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
