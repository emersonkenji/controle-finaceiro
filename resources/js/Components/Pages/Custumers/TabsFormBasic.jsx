import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { useMask } from "@react-input/mask";
import React, { useState } from "react";

export default function TabsFormBasic({ form }) {
    const [documentType, setDocumentType] = useState("pf");

    return (
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
                                <Input
                                {...field} />
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
                                    <Input
                                        type="email"
                                        {...field}
                                    />
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
                                    <Input
                                        ref={useMask({
                                            mask: "(__) _____-____",
                                            replacement: { _: /\d/ },
                                        })}
                                        placeholder="(99) 99999-9999"
                                        onChange={(e) => {
                                            field.onChange(e);
                                        }}
                                        value={field.value}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-7 gap-4 md:grid-cols-7">

                    <FormField
                        control={form.control}
                        name="document_type"
                        render={({ field }) => (
                            <FormItem className="col-span-1">
                                <FormLabel>Tipo</FormLabel>
                                <Select
                                    onValueChange={(values) => {
                                        setDocumentType(values);
                                        field.onChange(values);
                                    }}
                                    defaultValue={field.value || "pf"}
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {documentType === "pf" ? (
                    <FormField
                        control={form.control}
                        name="document_number"
                        render={({ field }) => (
                            <FormItem className="col-span-3">
                                <FormLabel>CPF</FormLabel>
                                <FormControl>
                                    <Input
                                        ref={useMask({
                                            mask: "___.___.___-__",
                                            replacement: { _: /\d/ },
                                        })}
                                        placeholder="999.999.999-99"

                                      onChange={(e) => {
                                            field.onChange(e);

                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    ):(<FormField
                        control={form.control}
                        name="document_number"
                        render={({ field }) => (
                            <FormItem className="col-span-3">
                                <FormLabel>CNPJ</FormLabel>
                                <FormControl>
                                    <Input
                                        ref={useMask({
                                            mask: "__.___.___/____-__",
                                            replacement: { _: /\d/ },
                                        })}
                                        placeholder="12.123.123/0001-12"
                                        value={field.value}
                                      onChange={(e) => {
                                            field.onChange(e);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />)}

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem className="col-span-3">
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
                                        <SelectItem value="regular">
                                            Regular
                                        </SelectItem>
                                        <SelectItem value="vip">VIP</SelectItem>
                                        <SelectItem value="premium">
                                            Premium
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
