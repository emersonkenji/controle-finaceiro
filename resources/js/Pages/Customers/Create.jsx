import { useRef, useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
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
    FormLabel,
    FormMessage,
} from '@/Components/ui/form';
import TabsFormBasic from '@/Components/Pages/Custumers/TabsFormBasic';
import TabsFormAddress from '@/Components/Pages/Custumers/TabsFormAddress';
import TabsFormAdditional from '@/Components/Pages/Custumers/TabsFormAdditional';

// Remover todo o formSchema do Zod

export default function CustomerForm({ customer = null }) {
    const [loading, setLoading] = useState(false);
    const isEditing = !!customer;

    const { data, setData, post, put, processing, errors } = useForm(customer || {
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
    });
    console.log(data);


    const searchCEP = async (cep) => {
        if (cep.replace(/\D/g, '').length !== 8) return;

        try {
            setLoading(true);
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (!data.erro) {
                const uf = data.uf ? data.uf.toUpperCase() : '';

                setData({
                    ...data,
                    address: {
                        ...data.address,
                        street: data.logradouro || '',
                        neighborhood: data.bairro || '',
                        city: data.localidade || '',
                        state: uf
                    }
                });
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            put(route('customers.update', customer.id));
        } else {
            post(route('customers.store'));
        }
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

                                <form onSubmit={onSubmit} className="space-y-6">
                                    <TabsContent value="basic">
                                        <TabsFormBasic data={data} setData={setData} errors={errors} />
                                    </TabsContent>

                                    <TabsContent value="address">
                                        <TabsFormAddress data={data} setData={setData} errors={errors} searchCEP={searchCEP} />
                                    </TabsContent>

                                    <TabsContent value="additional">
                                        <TabsFormAdditional data={data} setData={setData} errors={errors} />
                                    </TabsContent>

                                    <div className="flex justify-end gap-4">
                                        <Button variant="outline" type="button">
                                            Cancelar
                                        </Button>
                                        <Button type="submit" disabled={processing || loading}>
                                            {loading ? 'Salvando...' : isEditing ? 'Editar' : 'Salvar'}
                                        </Button>
                                    </div>
                                </form>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
