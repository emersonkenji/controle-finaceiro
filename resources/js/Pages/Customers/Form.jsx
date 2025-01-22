import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/Components/ui/tabs';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/Components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import InputMask from 'react-input-mask';

const formSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    cpf: z.string().min(14, 'CPF inválido'),
    phone: z.string().min(14, 'Telefone inválido'),
    category: z.string(),
    status: z.string(),
    address: z.object({
        cep: z.string().min(9, 'CEP inválido'),
        street: z.string().min(3, 'Rua deve ter no mínimo 3 caracteres'),
        number: z.string(),
        complement: z.string().optional(),
        neighborhood: z.string().min(3, 'Bairro deve ter no mínimo 3 caracteres'),
        city: z.string().min(3, 'Cidade deve ter no mínimo 3 caracteres'),
        state: z.string().length(2, 'Estado inválido')
    })
});

export default function CustomerForm({ customer = null }) {
    const [loading, setLoading] = useState(false);
    const isEditing = !!customer;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: customer || {
            name: '',
            email: '',
            cpf: '',
            phone: '',
            category: 'regular',
            status: 'active',
            address: {
                cep: '',
                street: '',
                number: '',
                complement: '',
                neighborhood: '',
                city: '',
                state: ''
            }
        }
    });

    const searchCEP = async (cep) => {
        if (cep.replace(/\D/g, '').length !== 8) return;

        try {
            setLoading(true);
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (!data.erro) {
                form.setValue('address.street', data.logradouro);
                form.setValue('address.neighborhood', data.bairro);
                form.setValue('address.city', data.localidade);
                form.setValue('address.state', data.uf);
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = (data) => {
        console.log(data);
        // Implementar lógica de salvamento
    };

    return (
        <AuthenticatedLayout>
            <Head title={isEditing ? 'Editar Cliente' : 'Novo Cliente'} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="mb-6 text-xl font-semibold text-gray-800">
                                {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
                            </h2>

                            <Tabs defaultValue="basic" className="w-full">
                                <TabsList>
                                    <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
                                    <TabsTrigger value="address">Endereço</TabsTrigger>
                                    <TabsTrigger value="additional">Informações Adicionais</TabsTrigger>
                                </TabsList>

                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <TabsContent value="basic">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Dados Básicos</CardTitle>
                                                    <CardDescription>
                                                        Informações principais do cliente
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="name"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Nome Completo</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                        <FormField
                                                            control={form.control}
                                                            name="email"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Email</FormLabel>
                                                                    <FormControl>
                                                                        <Input type="email" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name="phone"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Telefone</FormLabel>
                                                                    <FormControl>
                                                                        <InputMask
                                                                            mask="(99) 99999-9999"
                                                                            value={field.value}
                                                                            onChange={field.onChange}
                                                                        >
                                                                            {(inputProps) => <Input {...inputProps} />}
                                                                        </InputMask>
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                        <FormField
                                                            control={form.control}
                                                            name="cpf"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>CPF</FormLabel>
                                                                    <FormControl>
                                                                        <InputMask
                                                                            mask="999.999.999-99"
                                                                            value={field.value}
                                                                            onChange={field.onChange}
                                                                        >
                                                                            {(inputProps) => <Input {...inputProps} />}
                                                                        </InputMask>
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name="category"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Categoria</FormLabel>
                                                                    <Select
                                                                        onValueChange={field.onChange}
                                                                        defaultValue={field.value}
                                                                    >
                                                                        <FormControl>
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Selecione uma categoria" />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            <SelectItem value="regular">Regular</SelectItem>
                                                                            <SelectItem value="vip">VIP</SelectItem>
                                                                            <SelectItem value="premium">Premium</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        <TabsContent value="address">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Endereço</CardTitle>
                                                    <CardDescription>
                                                        Informações de endereço do cliente
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                        <FormField
                                                            control={form.control}
                                                            name="address.cep"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>CEP</FormLabel>
                                                                    <FormControl>
                                                                        <InputMask
                                                                            mask="99999-999"
                                                                            value={field.value}
                                                                            onChange={(e) => {
                                                                                field.onChange(e);
                                                                                searchCEP(e.target.value);
                                                                            }}
                                                                        >
                                                                            {(inputProps) => <Input {...inputProps} />}
                                                                        </InputMask>
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                        <div className="md:col-span-2">
                                                            <FormField
                                                                control={form.control}
                                                                name="address.street"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Rua</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        <FormField
                                                            control={form.control}
                                                            name="address.number"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Número</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>

                                                    <FormField
                                                        control={form.control}
                                                        name="address.complement"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Complemento</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                        <FormField
                                                            control={form.control}
                                                            name="address.neighborhood"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Bairro</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name="address.city"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Cidade</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={form.control}
                                                            name="address.state"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Estado</FormLabel>
                                                                    <Select
                                                                        onValueChange={field.onChange}
                                                                        defaultValue={field.value}
                                                                    >
                                                                        <FormControl>
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="UF" />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            {[
                                                                                'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF',
                                                                                'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
                                                                                'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS',
                                                                                'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
                                                                            ].map((state) => (
                                                                                <SelectItem key={state} value={state}>
                                                                                    {state}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        <TabsContent value="additional">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Informações Adicionais</CardTitle>
                                                    <CardDescription>
                                                        Outras informações importantes
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <FormField
                                                        control={form.control}
                                                        name="status"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Status</FormLabel>
                                                                <Select
                                                                    onValueChange={field.onChange}
                                                                    defaultValue={field.value}
                                                                >
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Selecione um status" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        <SelectItem value="active">Ativo</SelectItem>
                                                                        <SelectItem value="inactive">Inativo</SelectItem>
                                                                        <SelectItem value="blocked">Bloqueado</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        <div className="flex justify-end gap-4">
                                            <Button variant="outline" type="button">
                                                Cancelar
                                            </Button>
                                            <Button type="submit" disabled={loading}>
                                                {loading ? 'Salvando...' : 'Salvar'}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
