import { FormLabel } from "@/Components/Form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { FormMessage } from "@/Components/ui/form";
// import { FormLabel, FormMessage } from "@/Components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import React from "react";

export default function TabsFormAdditional({ data, setData, errors }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Informações Adicionais</CardTitle>
                <CardDescription>
                    Outras informações importantes
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div>
                    <FormLabel>Status</FormLabel>
                    <Select
                        value={data.status}
                        onValueChange={(value) => setData("status", value)}
                    >
                        <div>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um status" />
                            </SelectTrigger>
                        </div>
                        <SelectContent>
                            <SelectItem value="active">Ativo</SelectItem>
                            <SelectItem value="inactive">Inativo</SelectItem>
                            <SelectItem value="blocked">Bloqueado</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.status && (
                        <FormMessage>{errors.status}</FormMessage>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
