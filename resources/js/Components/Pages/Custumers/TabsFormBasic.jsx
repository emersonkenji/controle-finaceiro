import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
// import { FormLabel, FormMessage } from '@/Components/ui/form';
import { FormControl, FormItem, FormLabel, FormMessage } from "@/Components/Form";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { useMask, format } from "@react-input/mask";

export default function TabsFormBasic({ data, setData, errors }) {
    const [documentType, setDocumentType] = useState(data.document_type || "pf");

    console.log(errors);

      const options = {
        mask: documentType === "pf" ? "___.___.___-__" : "__.___.___/____-__",
        replacement: { _: /\d/ },
      };

    const formattedDocumentNumber = format(
        data.document_number || "",
        options,
    );

    const handleDocumentChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        const mask = documentType == "pf" ? "___.___.___-__" : "__.___.___/____-__";
        const formattedValue = format(rawValue, mask, { replacement: { _: /\d/ } });
        setData('document_number', formattedValue);
    };
    console.log(data);


    return (
        <Card>
            <CardHeader>
                <CardTitle>Dados Básicos</CardTitle>
                <CardDescription>
                    Informações principais do cliente
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                        <Input
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                        />
                    </FormControl>
                    <FormMessage>{errors.name}</FormMessage>
                </FormItem>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                            />
                        </FormControl>
                        <FormMessage>{errors.email}</FormMessage>
                    </FormItem>

                    <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                            <Input
                                ref={useMask({
                                    mask: "(__) _____-____",
                                    replacement: { _: /\d/ },
                                })}
                                placeholder="(99) 99999-9999"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                            />
                        </FormControl>
                        <FormMessage>{errors.phone}</FormMessage>
                    </FormItem>
                </div>

                <div className="grid grid-cols-7 gap-4 md:grid-cols-7">
                    <FormItem className="col-span-1">
                        <FormLabel>Tipo</FormLabel>
                        <Select
                            value={data.document_type}
                            onValueChange={(value) => {
                                setDocumentType(value);
                                setData('document_type', value);
                            }}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Documento" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="pf">CPF</SelectItem>
                                <SelectItem value="pj">CNPJ</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage>{errors.document_type}</FormMessage>
                    </FormItem>

                    <FormItem className="col-span-3">
                        <FormLabel>{documentType === "pf" ? "CPF" : "CNPJ"}</FormLabel>
                        <FormControl>

                            <Input
                                ref={useMask({
                                    mask: documentType === "pf" ? "___.___.___-__" : "__.___.___/____-__",
                                    replacement: { _: /\d/ },
                                })}
                                placeholder={documentType === "pf" ? "999.999.999-99" : "12.123.123/0001-12"}
                                // ={formattedDocumentNumber}
                                defaultValue={formattedDocumentNumber}

                                onChange={e => setData('document_number', e.target.value)}
                            />
                        </FormControl>
                        {errors.document_number && <FormMessage>{errors.document_number}</FormMessage>}
                    </FormItem>

                    <FormItem className="col-span-3">
                        <FormLabel>Categoria</FormLabel>
                        <Select
                            value={data.category || "regular"}
                            onValueChange={(value) => setData('category', value)}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent defaultValue="regular">
                                <SelectItem value="regular">
                                    Regular
                                </SelectItem>
                                <SelectItem value="vip">VIP</SelectItem>
                                <SelectItem value="premium">
                                    Premium
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage>{errors.category}</FormMessage>
                    </FormItem>
                </div>
            </CardContent>
        </Card>
    );
}
