import { useState } from 'react';
import {
    FileText,
    Download,
    Printer,
    Share2,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    ArrowLeft
} from 'lucide-react';
import FinancialChart from '@/Components/Charts/FinancialChart';
import ExportReportModal from '@/Components/Modals/ExportReportModal';
import ReportComments from '@/Components/ReportComments';

export default function ReportViewer({ report, onBack }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [zoom, setZoom] = useState(100);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showComments, setShowComments] = useState(false);

    // Dados de exemplo - posteriormente virão do backend
    const reportData = {
        revenue: {
            total: 168500.00,
            growth: 12.5,
            breakdown: {
                products: 125000.00,
                services: 43500.00
            },
            trend: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                data: [132000, 145000, 150000, 156000, 162000, 168500]
            }
        },
        expenses: {
            total: 98500.00,
            growth: -5.2,
            breakdown: {
                operational: 65000.00,
                marketing: 15500.00,
                administrative: 18000.00
            }
        },
        profit: {
            total: 70000.00,
            margin: 41.5,
            growth: 18.6
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatPercent = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(value / 100);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        console.log('Compartilhando relatório...');
    };

    const handleExport = (exportConfig) => {
        console.log('Configuração de exportação:', exportConfig);
        setShowExportModal(false);
    };

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 25, 200));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 25, 50));
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Barra de Ferramentas */}
            <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onBack}
                                className="p-2 text-gray-500 hover:text-gray-700"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-medium text-gray-900">
                                    {report.name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {report.period}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 mr-4">
                                <button
                                    onClick={handleZoomOut}
                                    className="p-2 text-gray-500 hover:text-gray-700"
                                >
                                    <ZoomOut className="h-5 w-5" />
                                </button>
                                <span className="text-sm text-gray-600">{zoom}%</span>
                                <button
                                    onClick={handleZoomIn}
                                    className="p-2 text-gray-500 hover:text-gray-700"
                                >
                                    <ZoomIn className="h-5 w-5" />
                                </button>
                            </div>
                            <button
                                onClick={handlePrint}
                                className="p-2 text-gray-500 hover:text-gray-700"
                            >
                                <Printer className="h-5 w-5" />
                            </button>
                            <button
                                onClick={handleShare}
                                className="p-2 text-gray-500 hover:text-gray-700"
                            >
                                <Share2 className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setShowExportModal(true)}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
                            >
                                <Download className="h-4 w-4 mr-1.5" />
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-3 gap-8">
                    {/* Relatório */}
                    <div className="col-span-2">
                        <div
                            className="bg-white shadow-sm rounded-lg p-8"
                            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                        >
                            {/* Cabeçalho do Relatório */}
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    {report.name}
                                </h1>
                                <p className="text-gray-500">
                                    Período: {report.period}
                                </p>
                            </div>

                            {/* Resumo Financeiro */}
                            <div className="grid grid-cols-3 gap-6 mb-8">
                                <div className="border rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Receita Total</h3>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(reportData.revenue.total)}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1 text-sm">
                                        <span className="text-green-600">+{reportData.revenue.growth}%</span>
                                        <span className="text-gray-500">vs. período anterior</span>
                                    </div>
                                </div>
                                <div className="border rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Despesas Totais</h3>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(reportData.expenses.total)}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1 text-sm">
                                        <span className="text-green-600">{reportData.expenses.growth}%</span>
                                        <span className="text-gray-500">vs. período anterior</span>
                                    </div>
                                </div>
                                <div className="border rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Lucro</h3>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(reportData.profit.total)}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1 text-sm">
                                        <span className="text-green-600">+{reportData.profit.growth}%</span>
                                        <span className="text-gray-500">Margem: {formatPercent(reportData.profit.margin)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Gráfico de Tendência */}
                            <div className="border rounded-lg p-6 mb-8">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Tendência de Receita</h3>
                                <div className="h-80">
                                    <FinancialChart
                                        type="line"
                                        data={{
                                            labels: reportData.revenue.trend.labels,
                                            datasets: [
                                                {
                                                    label: 'Receita',
                                                    data: reportData.revenue.trend.data,
                                                    borderColor: 'rgb(34, 197, 94)',
                                                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                                    fill: true
                                                }
                                            ]
                                        }}
                                        options={{
                                            plugins: {
                                                title: {
                                                    display: false
                                                }
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: {
                                                        callback: (value) => formatCurrency(value)
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Detalhamento */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="border rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Receitas por Categoria</h3>
                                    <div className="space-y-4">
                                        {Object.entries(reportData.revenue.breakdown).map(([category, value]) => (
                                            <div key={category} className="flex items-center justify-between">
                                                <span className="text-gray-600 capitalize">
                                                    {category}
                                                </span>
                                                <span className="font-medium">
                                                    {formatCurrency(value)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="border rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Despesas por Categoria</h3>
                                    <div className="space-y-4">
                                        {Object.entries(reportData.expenses.breakdown).map(([category, value]) => (
                                            <div key={category} className="flex items-center justify-between">
                                                <span className="text-gray-600 capitalize">
                                                    {category}
                                                </span>
                                                <span className="font-medium">
                                                    {formatCurrency(value)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comentários */}
                    <div className="col-span-1">
                        <ReportComments reportId={report.id} />
                    </div>
                </div>
            </div>

            {/* Modal de Exportação */}
            <ExportReportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                onExport={handleExport}
            />
        </div>
    );
}
