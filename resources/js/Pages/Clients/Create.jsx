import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Plus, Trash } from 'lucide-react';

export default function ClientCreate() {
    const [phones, setPhones] = useState([{ number: '', type: 'celular' }]);
    const [addresses, setAddresses] = useState([{
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        type: 'residencial'
    }]);

    const addPhone = () => {
        setPhones([...phones, { number: '', type: 'celular' }]);
    };

    const removePhone = (index) => {
        setPhones(phones.filter((_, i) => i !== index));
    };

    const addAddress = () => {
        setAddresses([...addresses, {
            cep: '',
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            type: 'residencial'
        }]);
    };

    const removeAddress = (index) => {
        setAddresses(addresses.filter((_, i) => i !== index));
    };

    const searchCEP = async (cep, index) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (!data.erro) {
                const updatedAddresses = [...addresses];
                updatedAddresses[index] = {
                    ...updatedAddresses[index],
                    street: data.logradouro,
                    neighborhood: data.bairro,
                    city: data.localidade,
                    state: data.uf
                };
                setAddresses(updatedAddresses);
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <a href={route('clients')} className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="h-5 w-5" />
                    </a>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Novo Cliente
                    </h2>
                </div>
            }
        >
            <Head title="Novo Cliente" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <form className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Dados Pessoais */}
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Dados Pessoais</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">CPF</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                                    <input
                                        type="date"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Telefones */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Telefones</h3>
                                <button
                                    type="button"
                                    onClick={addPhone}
                                    className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                                >
                                    <Plus className="h-4 w-4" />
                                    Adicionar Telefone
                                </button>
                            </div>
                            {phones.map((phone, index) => (
                                <div key={index} className="flex gap-4 items-start mb-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Número</label>
                                        <input
                                            type="text"
                                            value={phone.number}
                                            onChange={(e) => {
                                                const updatedPhones = [...phones];
                                                updatedPhones[index].number = e.target.value;
                                                setPhones(updatedPhones);
                                            }}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div className="w-40">
                                        <label className="block text-sm font-medium text-gray-700">Tipo</label>
                                        <select
                                            value={phone.type}
                                            onChange={(e) => {
                                                const updatedPhones = [...phones];
                                                updatedPhones[index].type = e.target.value;
                                                setPhones(updatedPhones);
                                            }}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="celular">Celular</option>
                                            <option value="residencial">Residencial</option>
                                            <option value="comercial">Comercial</option>
                                        </select>
                                    </div>
                                    {phones.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removePhone(index)}
                                            className="mt-6 text-red-600 hover:text-red-900"
                                        >
                                            <Trash className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Endereços */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Endereços</h3>
                                <button
                                    type="button"
                                    onClick={addAddress}
                                    className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                                >
                                    <Plus className="h-4 w-4" />
                                    Adicionar Endereço
                                </button>
                            </div>
                            {addresses.map((address, index) => (
                                <div key={index} className="mb-8 last:mb-0">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">CEP</label>
                                            <input
                                                type="text"
                                                value={address.cep}
                                                onChange={(e) => {
                                                    const updatedAddresses = [...addresses];
                                                    updatedAddresses[index].cep = e.target.value;
                                                    setAddresses(updatedAddresses);
                                                    if (e.target.value.length === 8) {
                                                        searchCEP(e.target.value, index);
                                                    }
                                                }}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Tipo</label>
                                            <select
                                                value={address.type}
                                                onChange={(e) => {
                                                    const updatedAddresses = [...addresses];
                                                    updatedAddresses[index].type = e.target.value;
                                                    setAddresses(updatedAddresses);
                                                }}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                <option value="residencial">Residencial</option>
                                                <option value="comercial">Comercial</option>
                                                <option value="entrega">Entrega</option>
                                            </select>
                                        </div>
                                        {addresses.length > 1 && (
                                            <div className="flex justify-end md:items-end">
                                                <button
                                                    type="button"
                                                    onClick={() => removeAddress(index)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash className="h-5 w-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Rua</label>
                                            <input
                                                type="text"
                                                value={address.street}
                                                onChange={(e) => {
                                                    const updatedAddresses = [...addresses];
                                                    updatedAddresses[index].street = e.target.value;
                                                    setAddresses(updatedAddresses);
                                                }}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Número</label>
                                                <input
                                                    type="text"
                                                    value={address.number}
                                                    onChange={(e) => {
                                                        const updatedAddresses = [...addresses];
                                                        updatedAddresses[index].number = e.target.value;
                                                        setAddresses(updatedAddresses);
                                                    }}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Complemento</label>
                                                <input
                                                    type="text"
                                                    value={address.complement}
                                                    onChange={(e) => {
                                                        const updatedAddresses = [...addresses];
                                                        updatedAddresses[index].complement = e.target.value;
                                                        setAddresses(updatedAddresses);
                                                    }}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Bairro</label>
                                            <input
                                                type="text"
                                                value={address.neighborhood}
                                                onChange={(e) => {
                                                    const updatedAddresses = [...addresses];
                                                    updatedAddresses[index].neighborhood = e.target.value;
                                                    setAddresses(updatedAddresses);
                                                }}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Cidade</label>
                                                <input
                                                    type="text"
                                                    value={address.city}
                                                    onChange={(e) => {
                                                        const updatedAddresses = [...addresses];
                                                        updatedAddresses[index].city = e.target.value;
                                                        setAddresses(updatedAddresses);
                                                    }}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Estado</label>
                                                <input
                                                    type="text"
                                                    value={address.state}
                                                    onChange={(e) => {
                                                        const updatedAddresses = [...addresses];
                                                        updatedAddresses[index].state = e.target.value;
                                                        setAddresses(updatedAddresses);
                                                    }}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Botões de Ação */}
                        <div className="p-6 bg-gray-50 flex justify-end gap-3">
                            <a
                                href={route('clients')}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancelar
                            </a>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Salvar Cliente
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
