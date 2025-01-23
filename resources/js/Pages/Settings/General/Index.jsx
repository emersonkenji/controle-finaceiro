import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Label } from '@/Components/ui/label';

export default function Index({ settings }) {
    const { data, setData, post, processing, errors } = useForm({
        app_name: settings.app_name,
        timezone: settings.timezone,
        locale: settings.locale,
        currency: settings.currency,
        date_format: settings.date_format,
        time_format: settings.time_format,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('settings.general.update'));
    }

    return (
        <AuthenticatedLayout>
            <Head title="Configurações Gerais" />

            <div className="p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">Configurações Gerais</h2>
                    <p className="text-gray-600">Gerencie as configurações básicas do sistema</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Configurações do Sistema</CardTitle>
                            <CardDescription>
                                Configure as opções básicas do sistema como nome, fuso horário e formato de data/hora
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="app_name">Nome do Sistema</Label>
                                    <Input
                                        id="app_name"
                                        value={data.app_name}
                                        onChange={e => setData('app_name', e.target.value)}
                                    />
                                    {errors.app_name && (
                                        <span className="text-sm text-red-500">{errors.app_name}</span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Fuso Horário</Label>
                                    <Select
                                        value={data.timezone}
                                        onValueChange={value => setData('timezone', value)}
                                    >
                                        <SelectTrigger id="timezone">
                                            <SelectValue placeholder="Selecione o fuso horário" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="America/Sao_Paulo">América/São Paulo</SelectItem>
                                            <SelectItem value="America/Manaus">América/Manaus</SelectItem>
                                            <SelectItem value="America/Belem">América/Belém</SelectItem>
                                            <SelectItem value="America/Fortaleza">América/Fortaleza</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.timezone && (
                                        <span className="text-sm text-red-500">{errors.timezone}</span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="locale">Idioma</Label>
                                    <Select
                                        value={data.locale}
                                        onValueChange={value => setData('locale', value)}
                                    >
                                        <SelectTrigger id="locale">
                                            <SelectValue placeholder="Selecione o idioma" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pt_BR">Português (Brasil)</SelectItem>
                                            <SelectItem value="en">English</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.locale && (
                                        <span className="text-sm text-red-500">{errors.locale}</span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="currency">Moeda</Label>
                                    <Select
                                        value={data.currency}
                                        onValueChange={value => setData('currency', value)}
                                    >
                                        <SelectTrigger id="currency">
                                            <SelectValue placeholder="Selecione a moeda" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BRL">Real (R$)</SelectItem>
                                            <SelectItem value="USD">Dólar ($)</SelectItem>
                                            <SelectItem value="EUR">Euro (€)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.currency && (
                                        <span className="text-sm text-red-500">{errors.currency}</span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date_format">Formato de Data</Label>
                                    <Select
                                        value={data.date_format}
                                        onValueChange={value => setData('date_format', value)}
                                    >
                                        <SelectTrigger id="date_format">
                                            <SelectValue placeholder="Selecione o formato de data" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="d/m/Y">DD/MM/YYYY</SelectItem>
                                            <SelectItem value="Y-m-d">YYYY-MM-DD</SelectItem>
                                            <SelectItem value="m/d/Y">MM/DD/YYYY</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.date_format && (
                                        <span className="text-sm text-red-500">{errors.date_format}</span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="time_format">Formato de Hora</Label>
                                    <Select
                                        value={data.time_format}
                                        onValueChange={value => setData('time_format', value)}
                                    >
                                        <SelectTrigger id="time_format">
                                            <SelectValue placeholder="Selecione o formato de hora" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="H:i">24 horas (14:30)</SelectItem>
                                            <SelectItem value="h:i A">12 horas (02:30 PM)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.time_format && (
                                        <span className="text-sm text-red-500">{errors.time_format}</span>
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
