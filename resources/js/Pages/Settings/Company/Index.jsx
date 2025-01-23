import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Upload } from 'lucide-react';

export default function Index({ settings }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        company_name: settings.company_name,
        company_document: settings.company_document,
        company_email: settings.company_email,
        company_phone: settings.company_phone,
        company_address: settings.company_address,
        company_city: settings.company_city,
        company_state: settings.company_state,
        company_zip: settings.company_zip,
        company_logo: null,
        _method: 'post'
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('settings.company.update'));
    }

    function handleFileChange(e) {
        setData('company_logo', e.target.files[0]);
    }

    return (
        <AuthenticatedLayout>
            <Head title="Configurações da Empresa" />

            <div className="p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">Configurações da Empresa</h2>
                    <p className="text-gray-600">Gerencie as informações da sua empresa</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações da Empresa</CardTitle>
                            <CardDescription>
                                Configure as informações básicas da sua empresa como nome, documentos e contatos
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="company_name">Nome da Empresa</Label>
                                    <Input
                                        id="company_name"
                                        value={data.company_name}
                                        onChange={e => setData('company_name', e.target.value)}
                                    />
                                    {errors.company_name && (
                                        <span className="text-sm text-red-500">{errors.company_name}</span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company_document">CNPJ</Label>
                                    <Input
                                        id="company_document"
                                        value={data.company_document}
                                        onChange={e => setData('company_document', e.target.value)}
                                    />
                                    {errors.company_document && (
                                        <span className="text-sm text-red-500">{errors.company_document}</span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company_email">E-mail</Label>
                                    <Input
                                        id="company_email"
                                        type="email"
                                        value={data.company_email}
                                        onChange={e => setData('company_email', e.target.value)}
                                    />
                                    {errors.company_email && (
                                        <span className="text-sm text-red-500">{errors.company_email}</span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company_phone">Telefone</Label>
                                    <Input
                                        id="company_phone"
                                        value={data.company_phone}
                                        onChange={e => setData('company_phone', e.target.value)}
                                    />
                                    {errors.company_phone && (
                                        <span className="text-sm text-red-500">{errors.company_phone}</span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company_address">Endereço</Label>
                                    <Input
                                        id="company_address"
                                        value={data.company_address}
                                        onChange={e => setData('company_address', e.target.value)}
                                    />
                                    {errors.company_address && (
                                        <span className="text-sm text-red-500">{errors.company_address}</span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company_city">Cidade</Label>
                                    <Input
                                        id="company_city"
                                        value={data.company_city}
                                        onChange={e => setData('company_city', e.target.value)}
                                    />
                                    {errors.company_city && (
                                        <span className="text-sm text-red-500">{errors.company_city}</span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company_state">Estado</Label>
                                    <Input
                                        id="company_state"
                                        value={data.company_state}
                                        onChange={e => setData('company_state', e.target.value)}
                                        maxLength={2}
                                    />
                                    {errors.company_state && (
                                        <span className="text-sm text-red-500">{errors.company_state}</span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company_zip">CEP</Label>
                                    <Input
                                        id="company_zip"
                                        value={data.company_zip}
                                        onChange={e => setData('company_zip', e.target.value)}
                                    />
                                    {errors.company_zip && (
                                        <span className="text-sm text-red-500">{errors.company_zip}</span>
                                    )}
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="company_logo">Logo da Empresa</Label>
                                    <div className="flex items-center gap-4">
                                        {settings.company_logo && (
                                            <img
                                                src={settings.company_logo}
                                                alt="Logo da empresa"
                                                className="w-32 h-32 object-contain"
                                            />
                                        )}
                                        <label
                                            htmlFor="company_logo"
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                                        >
                                            <Upload className="w-4 h-4" />
                                            <span>Enviar Logo</span>
                                            <input
                                                type="file"
                                                id="company_logo"
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>
                                    {errors.company_logo && (
                                        <span className="text-sm text-red-500">{errors.company_logo}</span>
                                    )}
                                    {progress && (
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-blue-600 h-2.5 rounded-full"
                                                style={{ width: `${progress.percentage}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Salvar Alterações
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
