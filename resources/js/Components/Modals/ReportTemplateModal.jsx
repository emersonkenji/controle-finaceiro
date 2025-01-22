import { useState } from 'react';
import {
    FileText,
    Plus,
    Trash2,
    X,
    Save,
    Copy,
    Download,
    Calendar,
    DollarSign,
    BarChart3
} from 'lucide-react';

export default function ReportTemplateModal({ isOpen, onClose, onSave }) {
    const [templates, setTemplates] = useState([
        {
            id: 1,
            name: 'Relatório Financeiro Mensal',
            description: 'Visão geral das finanças do mês',
            type: 'financial',
            sections: ['revenue', 'expenses', 'profit', 'goals'],
            charts: ['revenue_trend', 'expense_distribution'],
            period: 'month'
        },
        {
            id: 2,
            name: 'Performance de Vendas',
            description: 'Análise detalhada das vendas',
            type: 'sales',
            sections: ['sales_total', 'products', 'customers', 'goals'],
            charts: ['sales_trend', 'top_products'],
            period: 'week'
        }
    ]);

    const [newTemplate, setNewTemplate] = useState({
        name: '',
        description: '',
        type: 'custom',
        sections: [],
        charts: [],
        period: 'month'
    });

    const availableSections = [
        { id: 'revenue', name: 'Receita', icon: DollarSign },
        { id: 'expenses', name: 'Despesas', icon: DollarSign },
        { id: 'profit', name: 'Lucro', icon: DollarSign },
        { id: 'goals', name: 'Metas', icon: BarChart3 },
        { id: 'sales_total', name: 'Total de Vendas', icon: DollarSign },
        { id: 'products', name: 'Produtos', icon: FileText },
        { id: 'customers', name: 'Clientes', icon: FileText }
    ];

    const availableCharts = [
        { id: 'revenue_trend', name: 'Tendência de Receita' },
        { id: 'expense_distribution', name: 'Distribuição de Despesas' },
        { id: 'sales_trend', name: 'Tendência de Vendas' },
        { id: 'top_products', name: 'Top Produtos' }
    ];

    const handleAddTemplate = () => {
        if (newTemplate.name && newTemplate.sections.length > 0) {
            setTemplates([
                ...templates,
                {
                    ...newTemplate,
                    id: Math.max(...templates.map(t => t.id)) + 1
                }
            ]);
            setNewTemplate({
                name: '',
                description: '',
                type: 'custom',
                sections: [],
                charts: [],
                period: 'month'
            });
        }
    };

    const handleRemoveTemplate = (id) => {
        setTemplates(templates.filter(template => template.id !== id));
    };

    const handleDuplicateTemplate = (template) => {
        setTemplates([
            ...templates,
            {
                ...template,
                id: Math.max(...templates.map(t => t.id)) + 1,
                name: `${template.name} (Cópia)`
            }
        ]);
    };

    const handleSectionToggle = (sectionId) => {
        setNewTemplate(prev => ({
            ...prev,
            sections: prev.sections.includes(sectionId)
                ? prev.sections.filter(id => id !== sectionId)
                : [...prev.sections, sectionId]
        }));
    };

    const handleChartToggle = (chartId) => {
        setNewTemplate(prev => ({
            ...prev,
            charts: prev.charts.includes(chartId)
                ? prev.charts.filter(id => id !== chartId)
                : [...prev.charts, chartId]
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Cabeçalho */}
                <div className="px-6 py-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-medium text-gray-900">Templates de Relatório</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="px-6 py-4 max-h-[calc(90vh-8rem)] overflow-y-auto">
                    {/* Templates Existentes */}
                    <div className="space-y-4 mb-6">
                        {templates.map((template) => (
                            <div key={template.id} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                                        <p className="text-sm text-gray-500">{template.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleDuplicateTemplate(template)}
                                            className="p-2 text-gray-500 hover:text-gray-700"
                                        >
                                            <Copy className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleRemoveTemplate(template.id)}
                                            className="p-2 text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-700 mb-2">Seções</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {template.sections.map((section) => (
                                                <span
                                                    key={section}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                >
                                                    {availableSections.find(s => s.id === section)?.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-medium text-gray-700 mb-2">Gráficos</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {template.charts.map((chart) => (
                                                <span
                                                    key={chart}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                                >
                                                    {availableCharts.find(c => c.id === chart)?.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Novo Template */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="text-sm font-medium text-gray-700 mb-4">Adicionar Novo Template</h4>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        value={newTemplate.name}
                                        onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Nome do template"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Período
                                    </label>
                                    <select
                                        value={newTemplate.period}
                                        onChange={(e) => setNewTemplate({ ...newTemplate, period: e.target.value })}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="day">Diário</option>
                                        <option value="week">Semanal</option>
                                        <option value="month">Mensal</option>
                                        <option value="quarter">Trimestral</option>
                                        <option value="year">Anual</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descrição
                                </label>
                                <input
                                    type="text"
                                    value={newTemplate.description}
                                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Descrição do template"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Seções
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {availableSections.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => handleSectionToggle(section.id)}
                                            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                                                newTemplate.sections.includes(section.id)
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            <section.icon className="h-4 w-4 mr-1.5" />
                                            {section.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gráficos
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {availableCharts.map((chart) => (
                                        <button
                                            key={chart.id}
                                            onClick={() => handleChartToggle(chart.id)}
                                            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                                                newTemplate.charts.includes(chart.id)
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {chart.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleAddTemplate}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!newTemplate.name || newTemplate.sections.length === 0}
                                >
                                    <Plus className="h-4 w-4 mr-1.5" />
                                    Adicionar Template
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rodapé */}
                <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onSave(templates)}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
}
