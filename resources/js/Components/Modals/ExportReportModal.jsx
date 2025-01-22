import { useState } from 'react';
import {
    FileText,
    Download,
    X,
    Mail,
    FileSpreadsheet,
    FilePdf
} from 'lucide-react';

export default function ExportReportModal({ isOpen, onClose, onExport }) {
    const [format, setFormat] = useState('pdf');
    const [email, setEmail] = useState('');
    const [includeAttachments, setIncludeAttachments] = useState(true);

    const handleExport = () => {
        onExport({
            format,
            email: email || null,
            includeAttachments
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Cabeçalho */}
                <div className="px-6 py-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Download className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-medium text-gray-900">Exportar Relatório</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="px-6 py-4 space-y-6">
                    {/* Formato */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Formato
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => setFormat('pdf')}
                                className={`flex flex-col items-center p-3 border rounded-lg ${
                                    format === 'pdf'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <FilePdf className={`h-6 w-6 ${
                                    format === 'pdf' ? 'text-blue-500' : 'text-gray-400'
                                }`} />
                                <span className={`mt-2 text-sm ${
                                    format === 'pdf' ? 'text-blue-700' : 'text-gray-500'
                                }`}>
                                    PDF
                                </span>
                            </button>
                            <button
                                onClick={() => setFormat('excel')}
                                className={`flex flex-col items-center p-3 border rounded-lg ${
                                    format === 'excel'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <FileSpreadsheet className={`h-6 w-6 ${
                                    format === 'excel' ? 'text-blue-500' : 'text-gray-400'
                                }`} />
                                <span className={`mt-2 text-sm ${
                                    format === 'excel' ? 'text-blue-700' : 'text-gray-500'
                                }`}>
                                    Excel
                                </span>
                            </button>
                            <button
                                onClick={() => setFormat('csv')}
                                className={`flex flex-col items-center p-3 border rounded-lg ${
                                    format === 'csv'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <FileText className={`h-6 w-6 ${
                                    format === 'csv' ? 'text-blue-500' : 'text-gray-400'
                                }`} />
                                <span className={`mt-2 text-sm ${
                                    format === 'csv' ? 'text-blue-700' : 'text-gray-500'
                                }`}>
                                    CSV
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enviar por Email (opcional)
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Digite o email"
                                    className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Opções */}
                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={includeAttachments}
                                onChange={(e) => setIncludeAttachments(e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Incluir anexos e documentos relacionados
                            </span>
                        </label>
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
                        onClick={handleExport}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
                    >
                        <Download className="h-4 w-4 mr-1.5" />
                        Exportar
                    </button>
                </div>
            </div>
        </div>
    );
}
