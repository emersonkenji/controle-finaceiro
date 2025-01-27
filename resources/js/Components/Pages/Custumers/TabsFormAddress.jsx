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
import React from "react";

export default function TabsFormAddress({ form, searchCEP }) {
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
                    <FormField
                        control={form.control}
                        name="address.zip_code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CEP</FormLabel>
                                <FormControl>
                                    <Input
                                        ref={useMask({
                                            mask: "_____-___",
                                            replacement: { _: /\d/ },
                                        })}
                                        placeholder="99999-999"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            // const cep = e.target.value.replace(/\D/g, '');
                                            searchCEP(e.target.value);
                                        }}
                                    />
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
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="UF" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {[
                                            "AC",
                                            "AL",
                                            "AP",
                                            "AM",
                                            "BA",
                                            "CE",
                                            "DF",
                                            "ES",
                                            "GO",
                                            "MA",
                                            "MT",
                                            "MS",
                                            "MG",
                                            "PA",
                                            "PB",
                                            "PR",
                                            "PE",
                                            "PI",
                                            "RJ",
                                            "RN",
                                            "RS",
                                            "RO",
                                            "RR",
                                            "SC",
                                            "SP",
                                            "SE",
                                            "TO",
                                        ].map((state) => (
                                            <SelectItem
                                                key={state}
                                                value={state}
                                            >
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
    );
}
