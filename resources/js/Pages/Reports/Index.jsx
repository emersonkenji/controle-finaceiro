import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    FileText,
    Plus,
    Download,
    Calendar,
    Filter,
    Settings,
    Clock,
    Eye
} from 'lucide-react';
import ReportTemplateModal from '@/Components/Modals/ReportTemplateModal';
import GenerateReportModal from '@/Components/Modals/GenerateReportModal';
import ReportViewer from '@/Components/ReportViewer';

export default function Reports() {
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [period, setPeriod] = useState('month');

    // Dados de exemplo - posteriormente virão do backend
    const reports = [
        {
            id: 1,
            name: 'Relatório Financeiro - Junho/2024',
            template: 'Relatório Financeiro Mensal',
            status: 'ready',
            createdAt: new Date(),
            period: 'Junho/2024'
        },
        {
            id: 2,
            name: 'Performance de Vendas - Semana 24',
            template: 'Performance de Vendas',
            status: 'processing',
            createdAt: new Date(),
            period: 'Semana 24/2024'
        },
        {
            id: 3,
            name: 'Relatório Financeiro - Maio/2024',
            template: 'Relatório Financeiro Mensal',
            status: 'ready',
            createdAt: new Date(),
            period: 'Maio/2024'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'ready':
                return 'bg-green-100 text-green-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'error':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'ready':
                return 'Pronto';
            case 'processing':
                return 'Processando';
            case 'error':
                return 'Erro';
            default:
                return status;
        }
    };

    const handleGenerateReport = () => {
        setShowGenerateModal(true);
    };

    const handleReportGenerated = (reportConfig) => {
        console.log('Configuração do relatório:', reportConfig);
        setShowGenerateModal(false);
        // Aqui você chamaria a API para gerar o relatório
    };

    const handleDownloadReport = (reportId) => {
        console.log('Baixando relatório:', reportId);
    };

    const handleViewReport = (report) => {
        setSelectedReport(report);
    };

    const handleBackFromReport = () => {
        setSelectedReport(null);
    };

    if (selectedReport) {
        return <ReportViewer report={selectedReport} onBack={handleBackFromReport} />;
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Relatórios
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowTemplateModal(true)}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                        >
                            <Settings className="h-4 w-4 mr-1.5" />
                            Templates
                        </button>
                        <button
                            onClick={handleGenerateReport}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
                        >
                            <Plus className="h-4 w-4 mr-1.5" />
                            Gerar Relatório
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Relatórios" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Filtros */}
                    <div className="mb-6 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <select
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="week">Esta Semana</option>
                                <option value="month">Este Mês</option>
                                <option value="quarter">Este Trimestre</option>
                                <option value="year">Este Ano</option>
                            </select>
                        </div>
                    </div>

                    {/* Lista de Relatórios */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="space-y-4">
                                {reports.map((report) => (
                                    <div
                                        key={report.id}
                                        className="border rounded-lg p-4 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-blue-50 rounded-lg">
                                                <FileText className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-900">
                                                    {report.name}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-sm text-gray-500">
                                                        {report.template}
                                                    </span>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-sm text-gray-500">
                                                        {report.period}
                                                    </span>
                                                    <span className="text-gray-300">•</span>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                                        {getStatusText(report.status)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {report.status === 'ready' && (
                                                <>
                                                    <button
                                                        onClick={() => handleViewReport(report)}
                                                        className="p-2 text-gray-400 hover:text-gray-500"
                                                    >
                                                        <Eye className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDownloadReport(report.id)}
                                                        className="p-2 text-gray-400 hover:text-gray-500"
                                                    >
                                                        <Download className="h-5 w-5" />
                                                    </button>
                                                </>
                                            )}
                                            {report.status === 'processing' && (
                                                <Clock className="h-5 w-5 text-yellow-500 animate-spin" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Templates */}
            <ReportTemplateModal
                isOpen={showTemplateModal}
                onClose={() => setShowTemplateModal(false)}
                onSave={(templates) => {
                    console.log('Templates atualizados:', templates);
                    setShowTemplateModal(false);
                }}
            />

            {/* Modal de Geração de Relatório */}
            <GenerateReportModal
                isOpen={showGenerateModal}
                onClose={() => setShowGenerateModal(false)}
                onGenerate={handleReportGenerated}
            />
        </AuthenticatedLayout>
    );
}
