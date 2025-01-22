import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Building2, Receipt, Mail, Database, Link } from 'lucide-react';

export default function Settings({ company, tax, email, backup, integrations }) {
    const { data, setData, post, processing } = useForm({
        company: company,
        tax: tax,
        email: email,
        backup: backup,
        integrations: integrations
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('settings.update'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Configurações" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit}>
                                <Tabs defaultValue="company" className="space-y-6">
                                    <TabsList>
                                        <TabsTrigger value="company" className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4" />
                                            Empresa
                                        </TabsTrigger>
                                        <TabsTrigger value="tax" className="flex items-center gap-2">
                                            <Receipt className="w-4 h-4" />
                                            Impostos
                                        </TabsTrigger>
                                        <TabsTrigger value="email" className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            E-mail
                                        </TabsTrigger>
                                        <TabsTrigger value="backup" className="flex items-center gap-2">
                                            <Database className="w-4 h-4" />
                                            Backup
                                        </TabsTrigger>
                                        <TabsTrigger value="integrations" className="flex items-center gap-2">
                                            <Link className="w-4 h-4" />
                                            Integrações
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Empresa */}
                                    <TabsContent value="company" className="space-y-4">
                                        <div>
                                            <Label htmlFor="company.name">Nome da Empresa</Label>
                                            <Input
                                                id="company.name"
                                                value={data.company.name}
                                                onChange={e => setData('company', { ...data.company, name: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="company.cnpj">CNPJ</Label>
                                            <Input
                                                id="company.cnpj"
                                                value={data.company.cnpj}
                                                onChange={e => setData('company', { ...data.company, cnpj: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="company.phone">Telefone</Label>
                                            <Input
                                                id="company.phone"
                                                value={data.company.phone}
                                                onChange={e => setData('company', { ...data.company, phone: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="company.email">E-mail</Label>
                                            <Input
                                                id="company.email"
                                                type="email"
                                                value={data.company.email}
                                                onChange={e => setData('company', { ...data.company, email: e.target.value })}
                                            />
                                        </div>
                                    </TabsContent>

                                    {/* Impostos */}
                                    <TabsContent value="tax" className="space-y-4">
                                        <div>
                                            <Label htmlFor="tax.regime">Regime Tributário</Label>
                                            <Select
                                                value={data.tax.regime}
                                                onValueChange={value => setData('tax', { ...data.tax, regime: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o regime" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="simples">Simples Nacional</SelectItem>
                                                    <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
                                                    <SelectItem value="lucro_real">Lucro Real</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="tax.icms">ICMS (%)</Label>
                                            <Input
                                                id="tax.icms"
                                                type="number"
                                                step="0.01"
                                                value={data.tax.icms}
                                                onChange={e => setData('tax', { ...data.tax, icms: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="tax.pis">PIS (%)</Label>
                                            <Input
                                                id="tax.pis"
                                                type="number"
                                                step="0.01"
                                                value={data.tax.pis}
                                                onChange={e => setData('tax', { ...data.tax, pis: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="tax.cofins">COFINS (%)</Label>
                                            <Input
                                                id="tax.cofins"
                                                type="number"
                                                step="0.01"
                                                value={data.tax.cofins}
                                                onChange={e => setData('tax', { ...data.tax, cofins: e.target.value })}
                                            />
                                        </div>
                                    </TabsContent>

                                    {/* E-mail */}
                                    <TabsContent value="email" className="space-y-4">
                                        <div>
                                            <Label htmlFor="email.driver">Driver</Label>
                                            <Select
                                                value={data.email.driver}
                                                onValueChange={value => setData('email', { ...data.email, driver: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o driver" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="smtp">SMTP</SelectItem>
                                                    <SelectItem value="mailgun">Mailgun</SelectItem>
                                                    <SelectItem value="ses">Amazon SES</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="email.host">Host</Label>
                                            <Input
                                                id="email.host"
                                                value={data.email.host}
                                                onChange={e => setData('email', { ...data.email, host: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="email.port">Porta</Label>
                                            <Input
                                                id="email.port"
                                                type="number"
                                                value={data.email.port}
                                                onChange={e => setData('email', { ...data.email, port: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="email.username">Usuário</Label>
                                            <Input
                                                id="email.username"
                                                value={data.email.username}
                                                onChange={e => setData('email', { ...data.email, username: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="email.password">Senha</Label>
                                            <Input
                                                id="email.password"
                                                type="password"
                                                value={data.email.password}
                                                onChange={e => setData('email', { ...data.email, password: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="email.encryption">Criptografia</Label>
                                            <Select
                                                value={data.email.encryption}
                                                onValueChange={value => setData('email', { ...data.email, encryption: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione a criptografia" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="tls">TLS</SelectItem>
                                                    <SelectItem value="ssl">SSL</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </TabsContent>

                                    {/* Backup */}
                                    <TabsContent value="backup" className="space-y-4">
                                        <div>
                                            <Label htmlFor="backup.frequency">Frequência</Label>
                                            <Select
                                                value={data.backup.frequency}
                                                onValueChange={value => setData('backup', { ...data.backup, frequency: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione a frequência" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="daily">Diário</SelectItem>
                                                    <SelectItem value="weekly">Semanal</SelectItem>
                                                    <SelectItem value="monthly">Mensal</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="backup.retention">Retenção (dias)</Label>
                                            <Input
                                                id="backup.retention"
                                                type="number"
                                                value={data.backup.retention}
                                                onChange={e => setData('backup', { ...data.backup, retention: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="backup.storage">Armazenamento</Label>
                                            <Select
                                                value={data.backup.storage}
                                                onValueChange={value => setData('backup', { ...data.backup, storage: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o armazenamento" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="local">Local</SelectItem>
                                                    <SelectItem value="s3">Amazon S3</SelectItem>
                                                    <SelectItem value="dropbox">Dropbox</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </TabsContent>

                                    {/* Integrações */}
                                    <TabsContent value="integrations" className="space-y-4">
                                        <div>
                                            <Label>Gateway de Pagamento</Label>
                                            <div className="space-y-2">
                                                <div>
                                                    <Label htmlFor="integrations.payment_gateway.provider">Provedor</Label>
                                                    <Select
                                                        value={data.integrations.payment_gateway?.provider}
                                                        onValueChange={value => setData('integrations', {
                                                            ...data.integrations,
                                                            payment_gateway: {
                                                                ...data.integrations.payment_gateway,
                                                                provider: value
                                                            }
                                                        })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione o provedor" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="mercadopago">Mercado Pago</SelectItem>
                                                            <SelectItem value="pagseguro">PagSeguro</SelectItem>
                                                            <SelectItem value="stripe">Stripe</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div>
                                                    <Label htmlFor="integrations.payment_gateway.key">Chave de API</Label>
                                                    <Input
                                                        id="integrations.payment_gateway.key"
                                                        value={data.integrations.payment_gateway?.key}
                                                        onChange={e => setData('integrations', {
                                                            ...data.integrations,
                                                            payment_gateway: {
                                                                ...data.integrations.payment_gateway,
                                                                key: e.target.value
                                                            }
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <Label>NFe</Label>
                                            <div className="space-y-2">
                                                <div>
                                                    <Label htmlFor="integrations.nfe.provider">Provedor</Label>
                                                    <Select
                                                        value={data.integrations.nfe?.provider}
                                                        onValueChange={value => setData('integrations', {
                                                            ...data.integrations,
                                                            nfe: {
                                                                ...data.integrations.nfe,
                                                                provider: value
                                                            }
                                                        })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione o provedor" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="webmaniabr">WebmaniaBR</SelectItem>
                                                            <SelectItem value="nfse">NFSe</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div>
                                                    <Label htmlFor="integrations.nfe.key">Chave de API</Label>
                                                    <Input
                                                        id="integrations.nfe.key"
                                                        value={data.integrations.nfe?.key}
                                                        onChange={e => setData('integrations', {
                                                            ...data.integrations,
                                                            nfe: {
                                                                ...data.integrations.nfe,
                                                                key: e.target.value
                                                            }
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <div className="flex justify-end mt-6">
                                    <Button type="submit" disabled={processing}>
                                        Salvar Configurações
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
