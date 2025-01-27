import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { useMask } from "@react-input/mask";
import React, { useRef } from "react";

export default function TabsFormAddress({ data, setData, errors, searchCEP }) {
    const inputRef = useRef(null);
    const maskRef = useMask({
        mask: "_____-___",
        replacement: { _: /\d/ },
    });

    const handleChange = (field, value) => {
        setData(prevData => ({
            ...prevData,
            address: {
                ...prevData.address,
                [field]: value
            }
        }));
    };

    const handleCEPChange = async (e) => {
        const cep = e.target.value;
        handleChange('zip_code', cep);
        
        if (cep.length === 9) {
            try {
                const cleanCEP = cep.replace(/\D/g, '');
                const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
                const addressData = await response.json();

                if (!addressData.erro) {
                    setData('address', {
                        ...data.address,
                        zip_code: cep,
                        street: addressData.logradouro || '',
                        neighborhood: addressData.bairro || '',
                        city: addressData.localidade || '',
                        state: addressData.uf || '',
                        complement: addressData.complemento || data.address?.complement || ''
                    });
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
            }
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Endereço</CardTitle>
                <CardDescription>
                    Informações de endereço do cliente
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">CEP</label>
                        <input
                            ref={maskRef}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            placeholder="99999-999"
                            value={data.address?.zip_code || ''}
                            onChange={handleCEPChange}
                        />
                        {/* <input
                            ref={maskRef}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            placeholder="99999-999"
                            value={data.address?.zip_code || ''}
                            onChange={(e) => {
                                handleChange('zip_code', e.target.value);
                                if (e.target.value.length === 9) {
                                    searchCEP(e.target.value);
                                }
                            }}
                        /> */}
                        {errors['address.zip_code'] && (
                            <div className="text-sm text-red-500">{errors['address.zip_code']}</div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Rua</label>
                        <input
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            value={data.address?.street || ''}
                            onChange={e => handleChange('street', e.target.value)}
                        />
                        {errors['address.street'] && (
                            <div className="text-sm text-red-500">{errors['address.street']}</div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Número</label>
                        <input
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            value={data.address?.number || ''}
                            onChange={e => handleChange('number', e.target.value)}
                        />
                        {errors['address.number'] && (
                            <div className="text-sm text-red-500">{errors['address.number']}</div>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Complemento</label>
                    <input
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        value={data.address?.complement || ''}
                        onChange={e => handleChange('complement', e.target.value)}
                    />
                    {errors['address.complement'] && (
                        <div className="text-sm text-red-500">{errors['address.complement']}</div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Bairro</label>
                        <input
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            value={data.address?.neighborhood || ''}
                            onChange={e => handleChange('neighborhood', e.target.value)}
                        />
                        {errors['address.neighborhood'] && (
                            <div className="text-sm text-red-500">{errors['address.neighborhood']}</div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cidade</label>
                        <input
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            value={data.address?.city || ''}
                            onChange={e => handleChange('city', e.target.value)}
                        />
                        {errors['address.city'] && (
                            <div className="text-sm text-red-500">{errors['address.city']}</div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Estado</label>
                        <Select
                            value={data.address?.state || ''}
                            onValueChange={(value) => handleChange('state', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="UF" />
                            </SelectTrigger>
                            <SelectContent>
                                {[
                                    "AC", "AL", "AP", "AM", "BA", "CE", "DF",
                                    "ES", "GO", "MA", "MT", "MS", "MG", "PA",
                                    "PB", "PR", "PE", "PI", "RJ", "RN", "RS",
                                    "RO", "RR", "SC", "SP", "SE", "TO"
                                ].map((state) => (
                                    <SelectItem key={state} value={state}>
                                        {state}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors['address.state'] && (
                            <div className="text-sm text-red-500">{errors['address.state']}</div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}