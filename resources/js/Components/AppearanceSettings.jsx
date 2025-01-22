import { useState } from 'react';
import {
    Palette,
    Moon,
    Sun,
    Monitor,
    Layout,
    Type,
    AlertTriangle,
    Check,
    X
} from 'lucide-react';

export default function AppearanceSettings() {
    const [settings, setSettings] = useState({
        theme: {
            mode: 'system', // light, dark, system
            primaryColor: '#3B82F6',
            accentColor: '#10B981',
            borderRadius: 'md', // sm, md, lg, xl
            density: 'comfortable' // compact, comfortable, spacious
        },
        layout: {
            sidebarCollapsed: false,
            sidebarPosition: 'left', // left, right
            headerFixed: true,
            containerWidth: 'max-w-7xl', // max-w-5xl, max-w-6xl, max-w-7xl
            showBreadcrumbs: true
        },
        typography: {
            fontSize: 'base', // sm, base, lg
            fontFamily: 'inter', // inter, roboto, poppins
            lineHeight: 'normal', // relaxed, normal, snug
            useCustomFont: false
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

    return (
        <div className="space-y-8">
            {/* Tema */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Palette className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">
                        Tema
                    </h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Modo
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => handleChange('theme', 'mode', 'light')}
                                className={`
                                    flex items-center justify-center px-4 py-2 border rounded-md
                                    ${settings.theme.mode === 'light'
                                        ? 'bg-blue-50 border-blue-500 text-blue-600'
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }
                                `}
                            >
                                <Sun className="h-4 w-4 mr-1.5" />
                                Claro
                            </button>
                            <button
                                onClick={() => handleChange('theme', 'mode', 'dark')}
                                className={`
                                    flex items-center justify-center px-4 py-2 border rounded-md
                                    ${settings.theme.mode === 'dark'
                                        ? 'bg-blue-50 border-blue-500 text-blue-600'
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }
                                `}
                            >
                                <Moon className="h-4 w-4 mr-1.5" />
                                Escuro
                            </button>
                            <button
                                onClick={() => handleChange('theme', 'mode', 'system')}
                                className={`
                                    flex items-center justify-center px-4 py-2 border rounded-md
                                    ${settings.theme.mode === 'system'
                                        ? 'bg-blue-50 border-blue-500 text-blue-600'
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }
                                `}
                            >
                                <Monitor className="h-4 w-4 mr-1.5" />
                                Sistema
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cor Primária
                        </label>
                        <input
                            type="color"
                            value={settings.theme.primaryColor}
                            onChange={(e) => handleChange('theme', 'primaryColor', e.target.value)}
                            className="h-10 w-20 p-1 rounded border border-gray-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cor de Destaque
                        </label>
                        <input
                            type="color"
                            value={settings.theme.accentColor}
                            onChange={(e) => handleChange('theme', 'accentColor', e.target.value)}
                            className="h-10 w-20 p-1 rounded border border-gray-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Arredondamento das Bordas
                        </label>
                        <select
                            value={settings.theme.borderRadius}
                            onChange={(e) => handleChange('theme', 'borderRadius', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="sm">Pequeno</option>
                            <option value="md">Médio</option>
                            <option value="lg">Grande</option>
                            <option value="xl">Extra Grande</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Densidade
                        </label>
                        <select
                            value={settings.theme.density}
                            onChange={(e) => handleChange('theme', 'density', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="compact">Compacta</option>
                            <option value="comfortable">Confortável</option>
                            <option value="spacious">Espaçosa</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Layout */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Layout className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">
                        Layout
                    </h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.layout.sidebarCollapsed}
                                onChange={(e) => handleChange('layout', 'sidebarCollapsed', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Menu Lateral Recolhido
                            </span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Posição do Menu Lateral
                        </label>
                        <select
                            value={settings.layout.sidebarPosition}
                            onChange={(e) => handleChange('layout', 'sidebarPosition', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="left">Esquerda</option>
                            <option value="right">Direita</option>
                        </select>
                    </div>

                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.layout.headerFixed}
                                onChange={(e) => handleChange('layout', 'headerFixed', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Cabeçalho Fixo
                            </span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Largura do Conteúdo
                        </label>
                        <select
                            value={settings.layout.containerWidth}
                            onChange={(e) => handleChange('layout', 'containerWidth', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="max-w-5xl">Estreito</option>
                            <option value="max-w-6xl">Médio</option>
                            <option value="max-w-7xl">Largo</option>
                        </select>
                    </div>

                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.layout.showBreadcrumbs}
                                onChange={(e) => handleChange('layout', 'showBreadcrumbs', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Mostrar Navegação em Migalhas
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Tipografia */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Type className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">
                        Tipografia
                    </h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tamanho da Fonte
                        </label>
                        <select
                            value={settings.typography.fontSize}
                            onChange={(e) => handleChange('typography', 'fontSize', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="sm">Pequeno</option>
                            <option value="base">Médio</option>
                            <option value="lg">Grande</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fonte
                        </label>
                        <select
                            value={settings.typography.fontFamily}
                            onChange={(e) => handleChange('typography', 'fontFamily', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="inter">Inter</option>
                            <option value="roboto">Roboto</option>
                            <option value="poppins">Poppins</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Altura da Linha
                        </label>
                        <select
                            value={settings.typography.lineHeight}
                            onChange={(e) => handleChange('typography', 'lineHeight', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="relaxed">Relaxada</option>
                            <option value="normal">Normal</option>
                            <option value="snug">Compacta</option>
                        </select>
                    </div>

                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.typography.useCustomFont}
                                onChange={(e) => handleChange('typography', 'useCustomFont', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Usar Fonte Personalizada
                            </span>
                        </label>
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
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                <h3 className="text-lg font-medium text-gray-900">
                                    Confirmar Redefinição
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowResetModal(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="px-6 py-4">
                            <p className="text-sm text-gray-600">
                                Tem certeza que deseja redefinir todas as configurações de aparência para os valores padrão? Esta ação não pode ser desfeita.
                            </p>
                        </div>

                        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => setShowResetModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleReset}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm"
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
