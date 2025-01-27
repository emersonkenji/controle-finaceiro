import { useRef, useState, useEffect } from 'react';
import { Head, router, useForm as useInertiaForm } from '@inertiajs/react';
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
import TabsFormBasic from '@/Components/Pages/Custumers/TabsFormBasic';
import TabsFormAddress from '@/Components/Pages/Custumers/TabsFormAddress';

const formSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    document_type: z.string(),
    document_number: z.string(),
    phone: z.string().min(10, 'Telefone inválido'),
    category: z.string(),
    status: z.string(),
    address: z.object({
        zip_code: z.string().min(8, 'CEP inválido'),
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

    useEffect(() => {
        console.log('useEffect executado'); // Adicione esta linha
        console.log('Dados do cliente:', customer);
      }, [customer]);


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: customer || {
            name: '',
            email: '',
            document_type: 'pf',
            document_number: '',
            phone: '',
            category: 'regular',
            status: 'active',
            address: {
                zip_code: '',
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
            console.log('Data:', data);

            if (!data.erro) {
                console.log('Dados do ViaCEP:', data); // Log para debug
                const uf = data.uf ? data.uf.toUpperCase() : '';

                form.setValue('address.street', data.logradouro || '');
                form.setValue('address.neighborhood', data.bairro || '');
                form.setValue('address.city', data.localidade || '');

                // Atualiza o estado com trigger
                if (uf) {
                    form.setValue('address.state', uf, {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true
                    });
                }
            } else {
                console.log('Erro no viacep:', data.erro);
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
        } finally {
            setLoading(false);
        }
    };


    const onSubmit = (data) => {
        console.log("Dados do formulário:", data);
        console.log("Erros de validação:", form.formState.errors);
        const dataToSend = {
            ...data,
        }
        if(isEditing){
            router.put(route('customers.update', customer.id), dataToSend);
          }else {
             router.post(route('customers.store'), dataToSend);
          }
        // router.post(route('customers.store'), dataToSend);
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
                                            <TabsFormBasic form={form}/>
                                        </TabsContent>

                                        <TabsContent value="address">
                                            <TabsFormAddress form={form} searchCEP={searchCEP}/>
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
                                            {loading ? 'Salvando...' : isEditing ? 'Editar' : 'Salvar'}
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
