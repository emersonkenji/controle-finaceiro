import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    Building2,
    Users,
    Mail,
    Bell,
    Lock,
    CreditCard,
    Palette,
    Database,
    Save,
    Check
} from 'lucide-react';
import UserManagement from '@/Components/UserManagement';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('empresa');
    const [saved, setSaved] = useState(false);

    // Dados de exemplo - posteriormente virão do backend
    const [settings, setSettings] = useState({
        empresa: {
            nome: 'Minha Empresa LTDA',
            cnpj: '12.345.678/0001-90',
            telefone: '(11) 1234-5678',
            email: 'contato@minhaempresa.com',
            endereco: 'Rua Exemplo, 123',
            cidade: 'São Paulo',
            estado: 'SP',
            cep: '01234-567'
        },
        notificacoes: {
            emailVendas: true,
            emailFinanceiro: true,
            emailEstoque: false,
            pushVendas: true,
            pushFinanceiro: true,
            pushEstoque: true
        },
        financeiro: {
            moeda: 'BRL',
            formatoNumero: 'pt-BR',
            impostos: {
                icms: 18,
                iss: 5,
                pis: 0.65,
                cofins: 3
            },
            metodoPagamentoPadrao: 'dinheiro'
        },
        aparencia: {
            tema: 'light',
            corPrimaria: '#2563eb',
            corSecundaria: '#1e40af',
            mostrarLogo: true
        }
    });

    const tabs = [
        { id: 'empresa', name: 'Empresa', icon: Building2 },
        { id: 'usuarios', name: 'Usuários', icon: Users },
        { id: 'notificacoes', name: 'Notificações', icon: Bell },
        { id: 'seguranca', name: 'Segurança', icon: Lock },
        { id: 'financeiro', name: 'Financeiro', icon: CreditCard },
        { id: 'aparencia', name: 'Aparência', icon: Palette },
        { id: 'integracao', name: 'Integração', icon: Database }
    ];

    const handleSave = () => {
        // Aqui você enviaria as configurações para o backend
        console.log('Salvando configurações:', settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleChange = (section, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleNestedChange = (section, parent, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [parent]: {
                    ...prev[section][parent],
                    [field]: value
                }
            }
        }));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Configurações
                    </h2>
                    <button
                        onClick={handleSave}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm disabled:opacity-50"
                    >
                        {saved ? (
                            <>
                                <Check className="h-4 w-4 mr-1.5" />
                                Salvo!
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-1.5" />
                                Salvar Alterações
                            </>
                        )}
                    </button>
                </div>
            }
        >
            <Head title="Configurações" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`
                                                flex items-center py-4 px-1 border-b-2 font-medium text-sm
                                                ${activeTab === tab.id
                                                    ? 'border-blue-500 text-blue-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }
                                            `}
                                        >
                                            <tab.icon className="h-5 w-5 mr-2" />
                                            {tab.name}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <div className="mt-6">
                                {/* Empresa */}
                                {activeTab === 'empresa' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Nome da Empresa
                                                </label>
                                                <input
                                                    type="text"
                                                    value={settings.empresa.nome}
                                                    onChange={(e) => handleChange('empresa', 'nome', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    CNPJ
                                                </label>
                                                <input
                                                    type="text"
                                                    value={settings.empresa.cnpj}
                                                    onChange={(e) => handleChange('empresa', 'cnpj', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Telefone
                                                </label>
                                                <input
                                                    type="text"
                                                    value={settings.empresa.telefone}
                                                    onChange={(e) => handleChange('empresa', 'telefone', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={settings.empresa.email}
                                                    onChange={(e) => handleChange('empresa', 'email', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Endereço
                                                </label>
                                                <input
                                                    type="text"
                                                    value={settings.empresa.endereco}
                                                    onChange={(e) => handleChange('empresa', 'endereco', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Cidade
                                                </label>
                                                <input
                                                    type="text"
                                                    value={settings.empresa.cidade}
                                                    onChange={(e) => handleChange('empresa', 'cidade', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Estado
                                                </label>
                                                <input
                                                    type="text"
                                                    value={settings.empresa.estado}
                                                    onChange={(e) => handleChange('empresa', 'estado', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    CEP
                                                </label>
                                                <input
                                                    type="text"
                                                    value={settings.empresa.cep}
                                                    onChange={(e) => handleChange('empresa', 'cep', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Notificações */}
                                {activeTab === 'notificacoes' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                Notificações por Email
                                            </h3>
                                            <div className="space-y-4">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.notificacoes.emailVendas}
                                                        onChange={(e) => handleChange('notificacoes', 'emailVendas', e.target.checked)}
                                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-600">
                                                        Novas vendas
                                                    </span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.notificacoes.emailFinanceiro}
                                                        onChange={(e) => handleChange('notificacoes', 'emailFinanceiro', e.target.checked)}
                                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-600">
                                                        Atualizações financeiras
                                                    </span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.notificacoes.emailEstoque}
                                                        onChange={(e) => handleChange('notificacoes', 'emailEstoque', e.target.checked)}
                                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-600">
                                                        Alertas de estoque
                                                    </span>
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                Notificações Push
                                            </h3>
                                            <div className="space-y-4">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.notificacoes.pushVendas}
                                                        onChange={(e) => handleChange('notificacoes', 'pushVendas', e.target.checked)}
                                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-600">
                                                        Novas vendas
                                                    </span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.notificacoes.pushFinanceiro}
                                                        onChange={(e) => handleChange('notificacoes', 'pushFinanceiro', e.target.checked)}
                                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-600">
                                                        Atualizações financeiras
                                                    </span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.notificacoes.pushEstoque}
                                                        onChange={(e) => handleChange('notificacoes', 'pushEstoque', e.target.checked)}
                                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-600">
                                                        Alertas de estoque
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Financeiro */}
                                {activeTab === 'financeiro' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Moeda
                                                </label>
                                                <select
                                                    value={settings.financeiro.moeda}
                                                    onChange={(e) => handleChange('financeiro', 'moeda', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                >
                                                    <option value="BRL">Real (BRL)</option>
                                                    <option value="USD">Dólar (USD)</option>
                                                    <option value="EUR">Euro (EUR)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Formato de Número
                                                </label>
                                                <select
                                                    value={settings.financeiro.formatoNumero}
                                                    onChange={(e) => handleChange('financeiro', 'formatoNumero', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                >
                                                    <option value="pt-BR">Brasileiro (1.234,56)</option>
                                                    <option value="en-US">Americano (1,234.56)</option>
                                                    <option value="de-DE">Europeu (1.234,56)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                Impostos Padrão
                                            </h3>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        ICMS (%)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={settings.financeiro.impostos.icms}
                                                        onChange={(e) => handleNestedChange('financeiro', 'impostos', 'icms', parseFloat(e.target.value))}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        ISS (%)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={settings.financeiro.impostos.iss}
                                                        onChange={(e) => handleNestedChange('financeiro', 'impostos', 'iss', parseFloat(e.target.value))}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        PIS (%)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={settings.financeiro.impostos.pis}
                                                        onChange={(e) => handleNestedChange('financeiro', 'impostos', 'pis', parseFloat(e.target.value))}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        COFINS (%)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={settings.financeiro.impostos.cofins}
                                                        onChange={(e) => handleNestedChange('financeiro', 'impostos', 'cofins', parseFloat(e.target.value))}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Método de Pagamento Padrão
                                            </label>
                                            <select
                                                value={settings.financeiro.metodoPagamentoPadrao}
                                                onChange={(e) => handleChange('financeiro', 'metodoPagamentoPadrao', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            >
                                                <option value="dinheiro">Dinheiro</option>
                                                <option value="cartao">Cartão de Crédito</option>
                                                <option value="pix">PIX</option>
                                                <option value="boleto">Boleto</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {/* Aparência */}
                                {activeTab === 'aparencia' && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Tema
                                            </label>
                                            <select
                                                value={settings.aparencia.tema}
                                                onChange={(e) => handleChange('aparencia', 'tema', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            >
                                                <option value="light">Claro</option>
                                                <option value="dark">Escuro</option>
                                                <option value="system">Sistema</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Cor Primária
                                                </label>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <input
                                                        type="color"
                                                        value={settings.aparencia.corPrimaria}
                                                        onChange={(e) => handleChange('aparencia', 'corPrimaria', e.target.value)}
                                                        className="h-8 w-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={settings.aparencia.corPrimaria}
                                                        onChange={(e) => handleChange('aparencia', 'corPrimaria', e.target.value)}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Cor Secundária
                                                </label>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <input
                                                        type="color"
                                                        value={settings.aparencia.corSecundaria}
                                                        onChange={(e) => handleChange('aparencia', 'corSecundaria', e.target.value)}
                                                        className="h-8 w-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={settings.aparencia.corSecundaria}
                                                        onChange={(e) => handleChange('aparencia', 'corSecundaria', e.target.value)}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.aparencia.mostrarLogo}
                                                    onChange={(e) => handleChange('aparencia', 'mostrarLogo', e.target.checked)}
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-600">
                                                    Mostrar logo na barra superior
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* Usuários */}
                                {activeTab === 'usuarios' && (
                                    <UserManagement />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
