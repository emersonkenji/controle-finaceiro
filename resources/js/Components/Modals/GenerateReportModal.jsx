import { useState } from 'react';
import {
    FileText,
    Calendar,
    ChevronRight,
    X,
    Play
} from 'lucide-react';

export default function GenerateReportModal({ isOpen, onClose, onGenerate }) {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [reportName, setReportName] = useState('');
    const [period, setPeriod] = useState({
        type: 'month',
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    // Dados de exemplo - posteriormente virão do backend
    const templates = [
        {
            id: 1,
            name: 'Relatório Financeiro Mensal',
            description: 'Visão geral das finanças do mês',
            type: 'financial',
            sections: ['revenue', 'expenses', 'profit', 'goals'],
            charts: ['revenue_trend', 'expense_distribution']
        },
        {
            id: 2,
            name: 'Performance de Vendas',
            description: 'Análise detalhada das vendas',
            type: 'sales',
            sections: ['sales_total', 'products', 'customers', 'goals'],
            charts: ['sales_trend', 'top_products']
        }
    ];

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        setReportName(`${template.name} - ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`);
    };

    const handleGenerate = () => {
        if (selectedTemplate && reportName) {
            onGenerate({
                templateId: selectedTemplate.id,
                name: reportName,
                period
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                {/* Cabeçalho */}
                <div className="px-6 py-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-medium text-gray-900">Gerar Relatório</h3>
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
                    {!selectedTemplate ? (
                        // Seleção de Template
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-gray-700">Selecione um Template</h4>
                            {templates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => handleTemplateSelect(template)}
                                    className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h5 className="font-medium text-gray-900">{template.name}</h5>
                                            <p className="text-sm text-gray-500">{template.description}</p>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-400" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        // Configuração do Relatório
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome do Relatório
                                </label>
                                <input
                                    type="text"
                                    value={reportName}
                                    onChange={(e) => setReportName(e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de Período
                                </label>
                                <select
                                    value={period.type}
                                    onChange={(e) => setPeriod({ ...period, type: e.target.value })}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="day">Diário</option>
                                    <option value="week">Semanal</option>
                                    <option value="month">Mensal</option>
                                    <option value="quarter">Trimestral</option>
                                    <option value="year">Anual</option>
                                    <option value="custom">Personalizado</option>
                                </select>
                            </div>

                            {period.type === 'custom' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Data Inicial
                                        </label>
                                        <input
                                            type="date"
                                            value={period.start}
                                            onChange={(e) => setPeriod({ ...period, start: e.target.value })}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Data Final
                                        </label>
                                        <input
                                            type="date"
                                            value={period.end}
                                            onChange={(e) => setPeriod({ ...period, end: e.target.value })}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h5 className="text-sm font-medium text-gray-700 mb-2">Template Selecionado</h5>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{selectedTemplate.name}</p>
                                        <p className="text-sm text-gray-500">{selectedTemplate.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Rodapé */}
                <div className="px-6 py-4 border-t bg-gray-50 flex justify-between">
                    <button
                        onClick={() => selectedTemplate ? setSelectedTemplate(null) : onClose()}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                        {selectedTemplate ? 'Voltar' : 'Cancelar'}
                    </button>
                    {selectedTemplate && (
                        <button
                            onClick={handleGenerate}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!reportName}
                        >
                            <Play className="h-4 w-4 mr-1.5" />
                            Gerar Relatório
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
