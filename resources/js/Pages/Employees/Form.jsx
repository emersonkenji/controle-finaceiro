import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';

export default function Form({ employee = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: employee?.name || '',
        email: employee?.email || '',
        phone: employee?.phone || '',
        document: employee?.document || '',
        birth_date: employee?.birth_date || '',
        hire_date: employee?.hire_date || '',
        termination_date: employee?.termination_date || '',
        position: employee?.position || '',
        department: employee?.department || '',
        salary: employee?.salary || '',
        commission_rate: employee?.commission_rate || '',
        status: employee?.status === 'active',
        notes: employee?.notes || '',
        attachments: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (employee) {
            put(route('employees.update', employee.id));
        } else {
            post(route('employees.store'));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={employee ? 'Editar Funcionário' : 'Novo Funcionário'} />

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center mb-6">
                    <Link href={route('employees.index')}>
                        <Button variant="ghost" className="mr-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-semibold">
                        {employee ? 'Editar Funcionário' : 'Novo Funcionário'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                error={errors.email}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="phone">Telefone</Label>
                            <Input
                                id="phone"
                                type="text"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                error={errors.phone}
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="document">CPF</Label>
                            <Input
                                id="document"
                                type="text"
                                value={data.document}
                                onChange={e => setData('document', e.target.value)}
                                error={errors.document}
                            />
                            {errors.document && (
                                <p className="text-sm text-red-600 mt-1">{errors.document}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="birth_date">Data de Nascimento</Label>
                            <Input
                                id="birth_date"
                                type="date"
                                value={data.birth_date}
                                onChange={e => setData('birth_date', e.target.value)}
                                error={errors.birth_date}
                            />
                            {errors.birth_date && (
                                <p className="text-sm text-red-600 mt-1">{errors.birth_date}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="hire_date">Data de Admissão</Label>
                            <Input
                                id="hire_date"
                                type="date"
                                value={data.hire_date}
                                onChange={e => setData('hire_date', e.target.value)}
                                error={errors.hire_date}
                            />
                            {errors.hire_date && (
                                <p className="text-sm text-red-600 mt-1">{errors.hire_date}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="termination_date">Data de Demissão</Label>
                            <Input
                                id="termination_date"
                                type="date"
                                value={data.termination_date}
                                onChange={e => setData('termination_date', e.target.value)}
                                error={errors.termination_date}
                            />
                            {errors.termination_date && (
                                <p className="text-sm text-red-600 mt-1">{errors.termination_date}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="position">Cargo</Label>
                            <Input
                                id="position"
                                type="text"
                                value={data.position}
                                onChange={e => setData('position', e.target.value)}
                                error={errors.position}
                            />
                            {errors.position && (
                                <p className="text-sm text-red-600 mt-1">{errors.position}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="department">Departamento</Label>
                            <Input
                                id="department"
                                type="text"
                                value={data.department}
                                onChange={e => setData('department', e.target.value)}
                                error={errors.department}
                            />
                            {errors.department && (
                                <p className="text-sm text-red-600 mt-1">{errors.department}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="salary">Salário</Label>
                            <Input
                                id="salary"
                                type="number"
                                step="0.01"
                                value={data.salary}
                                onChange={e => setData('salary', e.target.value)}
                                error={errors.salary}
                            />
                            {errors.salary && (
                                <p className="text-sm text-red-600 mt-1">{errors.salary}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="commission_rate">Taxa de Comissão (%)</Label>
                            <Input
                                id="commission_rate"
                                type="number"
                                step="0.01"
                                value={data.commission_rate}
                                onChange={e => setData('commission_rate', e.target.value)}
                                error={errors.commission_rate}
                            />
                            {errors.commission_rate && (
                                <p className="text-sm text-red-600 mt-1">{errors.commission_rate}</p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="status"
                                checked={data.status}
                                onCheckedChange={checked => setData('status', checked)}
                            />
                            <Label htmlFor="status">Ativo</Label>
                            {errors.status && (
                                <p className="text-sm text-red-600 mt-1">{errors.status}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="notes">Observações</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                                error={errors.notes}
                                rows={4}
                            />
                            {errors.notes && (
                                <p className="text-sm text-red-600 mt-1">{errors.notes}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="attachments">Documentos</Label>
                            <Input
                                id="attachments"
                                type="file"
                                onChange={e => setData('attachments', e.target.files)}
                                error={errors.attachments}
                                multiple
                            />
                            {errors.attachments && (
                                <p className="text-sm text-red-600 mt-1">{errors.attachments}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {employee ? 'Atualizar' : 'Cadastrar'}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
