import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('settings.users.store'));
    }

    return (
        <AuthenticatedLayout>
            <Head title="Novo Usuário" />

            <div className="p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">Novo Usuário</h2>
                    <p className="text-gray-600">Crie um novo usuário para acessar o sistema</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações do Usuário</CardTitle>
                            <CardDescription>
                                Preencha as informações abaixo para criar um novo usuário
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    {errors.name && (
                                        <span className="text-sm text-red-500">{errors.name}</span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">E-mail</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                    />
                                    {errors.email && (
                                        <span className="text-sm text-red-500">{errors.email}</span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Senha</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                    />
                                    {errors.password && (
                                        <span className="text-sm text-red-500">{errors.password}</span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Confirmar Senha</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                    />
                                    {errors.password_confirmation && (
                                        <span className="text-sm text-red-500">{errors.password_confirmation}</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Criar Usuário
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
