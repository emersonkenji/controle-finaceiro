import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
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
import SecuritySettings from '@/Components/SecuritySettings';
import NotificationSettings from '@/Components/NotificationSettings';
import FinancialSettings from '@/Components/FinancialSettings';
import AppearanceSettings from '@/Components/AppearanceSettings';
import IntegrationSettings from '@/Components/IntegrationSettings';
import CompanySettings from '@/Components/CompanySettings';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('empresa');
    const [saved, setSaved] = useState(false);

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
        // Aqui você enviaria uma requisição para salvar as configurações
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Configurações" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Configurações
                                </h2>
                                <button
                                    onClick={handleSave}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
                                >
                                    {saved ? (
                                        <>
                                            <Check className="h-4 w-4 mr-1.5" />
                                            Salvo!
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-1.5" />
                                            Salvar
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Navigation */}
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`
                                                    ${activeTab === tab.id
                                                        ? 'border-blue-500 text-blue-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                    }
                                                    group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                                                `}
                                            >
                                                <Icon className={`
                                                    ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                                                    -ml-0.5 mr-2 h-5 w-5
                                                `} />
                                                {tab.name}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* Content */}
                            <div className="mt-6">
                                {activeTab === 'empresa' && (
                                    <CompanySettings />
                                )}

                                {activeTab === 'usuarios' && (
                                    <UserManagement />
                                )}

                                {activeTab === 'notificacoes' && (
                                    <NotificationSettings />
                                )}

                                {activeTab === 'seguranca' && (
                                    <SecuritySettings />
                                )}

                                {activeTab === 'financeiro' && (
                                    <FinancialSettings />
                                )}

                                {activeTab === 'aparencia' && (
                                    <AppearanceSettings />
                                )}

                                {activeTab === 'integracao' && (
                                    <IntegrationSettings />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
