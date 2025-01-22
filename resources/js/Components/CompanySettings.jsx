import { useState } from 'react';
import {
    Building2,
    MapPin,
    Phone,
    Mail,
    Globe,
    FileText,
    AlertTriangle,
    Check,
    X,
    Upload
} from 'lucide-react';

export default function CompanySettings() {
    const [settings, setSettings] = useState({
        basic: {
            name: 'Minha Empresa LTDA',
            tradingName: 'Minha Empresa',
            cnpj: '12.345.678/0001-90',
            stateRegistration: '123456789',
            municipalRegistration: '987654321',
            logo: null,
            website: 'www.minhaempresa.com.br'
        },
        address: {
            street: 'Rua Principal',
            number: '1234',
            complement: 'Sala 101',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234-567',
            country: 'Brasil'
        },
        contact: {
            phone: '(11) 1234-5678',
            mobile: '(11) 98765-4321',
            email: 'contato@minhaempresa.com.br',
            alternativeEmail: 'financeiro@minhaempresa.com.br'
        },
        fiscal: {
            regime: 'simples', // simples, lucro_presumido, lucro_real
            cnae: '4751-2/01',
            activityDescription: 'Comércio varejista especializado de equipamentos e suprimentos de informática',
            municipalService: '1.05 - Licenciamento ou cessão de direito de uso de programas de computação',
            taxRegime: 'normal' // normal, simples, isento
        }
    });

    const [showResetModal, setShowResetModal] = useState(false);

    const handleChange = (section, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleReset = () => {
        // Aqui você enviaria uma requisição para redefinir as configurações
        setShowResetModal(false);
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Aqui você enviaria o arquivo para o servidor
            // Por enquanto, apenas simularemos com uma URL local
            handleChange('basic', 'logo', URL.createObjectURL(file));
        }
    };

    return (
        <div className="space-y-8">
            {/* Informações Básicas */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">
                        Informações Básicas
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Razão Social
                        </label>
                        <input
                            type="text"
                            value={settings.basic.name}
                            onChange={(e) => handleChange('basic', 'name', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nome Fantasia
                        </label>
                        <input
                            type="text"
                            value={settings.basic.tradingName}
                            onChange={(e) => handleChange('basic', 'tradingName', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            CNPJ
                        </label>
                        <input
                            type="text"
                            value={settings.basic.cnpj}
                            onChange={(e) => handleChange('basic', 'cnpj', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Inscrição Estadual
                        </label>
                        <input
                            type="text"
                            value={settings.basic.stateRegistration}
                            onChange={(e) => handleChange('basic', 'stateRegistration', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Inscrição Municipal
                        </label>
                        <input
                            type="text"
                            value={settings.basic.municipalRegistration}
                            onChange={(e) => handleChange('basic', 'municipalRegistration', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Website
                        </label>
                        <input
                            type="text"
                            value={settings.basic.website}
                            onChange={(e) => handleChange('basic', 'website', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Logo
                        </label>
                        <div className="flex items-center gap-4 mt-1">
                            {settings.basic.logo && (
                                <img
                                    src={settings.basic.logo}
                                    alt="Logo da empresa"
                                    className="object-contain w-12 h-12"
                                />
                            )}
                            <label className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50">
                                <Upload className="h-4 w-4 mr-1.5" />
                                Enviar Logo
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Endereço */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">
                        Endereço
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Logradouro
                        </label>
                        <input
                            type="text"
                            value={settings.address.street}
                            onChange={(e) => handleChange('address', 'street', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Número
                        </label>
                        <input
                            type="text"
                            value={settings.address.number}
                            onChange={(e) => handleChange('address', 'number', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Complemento
                        </label>
                        <input
                            type="text"
                            value={settings.address.complement}
                            onChange={(e) => handleChange('address', 'complement', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Bairro
                        </label>
                        <input
                            type="text"
                            value={settings.address.neighborhood}
                            onChange={(e) => handleChange('address', 'neighborhood', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            CEP
                        </label>
                        <input
                            type="text"
                            value={settings.address.zipCode}
                            onChange={(e) => handleChange('address', 'zipCode', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Cidade
                        </label>
                        <input
                            type="text"
                            value={settings.address.city}
                            onChange={(e) => handleChange('address', 'city', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Estado
                        </label>
                        <input
                            type="text"
                            value={settings.address.state}
                            onChange={(e) => handleChange('address', 'state', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Contato */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">
                        Contato
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Telefone
                        </label>
                        <input
                            type="text"
                            value={settings.contact.phone}
                            onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Celular
                        </label>
                        <input
                            type="text"
                            value={settings.contact.mobile}
                            onChange={(e) => handleChange('contact', 'mobile', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email Principal
                        </label>
                        <input
                            type="email"
                            value={settings.contact.email}
                            onChange={(e) => handleChange('contact', 'email', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email Alternativo
                        </label>
                        <input
                            type="email"
                            value={settings.contact.alternativeEmail}
                            onChange={(e) => handleChange('contact', 'alternativeEmail', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Informações Fiscais */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">
                        Informações Fiscais
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Regime Tributário
                        </label>
                        <select
                            value={settings.fiscal.regime}
                            onChange={(e) => handleChange('fiscal', 'regime', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="simples">Simples Nacional</option>
                            <option value="lucro_presumido">Lucro Presumido</option>
                            <option value="lucro_real">Lucro Real</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            CNAE Principal
                        </label>
                        <input
                            type="text"
                            value={settings.fiscal.cnae}
                            onChange={(e) => handleChange('fiscal', 'cnae', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Descrição da Atividade
                        </label>
                        <textarea
                            value={settings.fiscal.activityDescription}
                            onChange={(e) => handleChange('fiscal', 'activityDescription', e.target.value)}
                            rows={3}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Serviço Municipal
                        </label>
                        <input
                            type="text"
                            value={settings.fiscal.municipalService}
                            onChange={(e) => handleChange('fiscal', 'municipalService', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Regime de Tributação
                        </label>
                        <select
                            value={settings.fiscal.taxRegime}
                            onChange={(e) => handleChange('fiscal', 'taxRegime', e.target.value)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="normal">Normal</option>
                            <option value="simples">Simples Nacional</option>
                            <option value="isento">Isento</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-3">
                <button
                    onClick={() => setShowResetModal(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                    <AlertTriangle className="h-4 w-4 mr-1.5" />
                    Redefinir Padrões
                </button>
            </div>

            {/* Modal de Confirmação de Reset */}
            {showResetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
                    <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                <h3 className="text-lg font-medium text-gray-900">
                                    Confirmar Redefinição
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowResetModal(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="px-6 py-4">
                            <p className="text-sm text-gray-600">
                                Tem certeza que deseja redefinir todas as configurações da empresa para os valores padrão? Esta ação não pode ser desfeita.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                            <button
                                onClick={() => setShowResetModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleReset}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700"
                            >
                                <AlertTriangle className="h-4 w-4 mr-1.5" />
                                Redefinir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
