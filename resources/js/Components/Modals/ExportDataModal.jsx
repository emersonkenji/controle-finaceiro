import { useState } from 'react';
import { X, FileSpreadsheet, FileText, Download } from 'lucide-react';

export default function ExportDataModal({ isOpen, onClose, onExport }) {
    const [format, setFormat] = useState('excel');
    const [dateRange, setDateRange] = useState('month');
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [includeFields, setIncludeFields] = useState({
        date: true,
        description: true,
        department: true,
        category: true,
        amount: true,
        status: true,
        notes: false,
        attachments: false
    });

    const handleExport = () => {
        onExport({
            format,
            dateRange,
            selectedDepartments,
            includeFields
        });
    };

    const handleDepartmentToggle = (deptId) => {
        setSelectedDepartments(prev =>
            prev.includes(deptId)
                ? prev.filter(id => id !== deptId)
                : [...prev, deptId]
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-lg font-medium">Exportar Dados</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="space-y-6">
                        {/* Formato de Exportação */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Formato
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormat('excel')}
                                    className={`flex items-center gap-3 p-4 border rounded-lg ${
                                        format === 'excel'
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <FileSpreadsheet className={`h-6 w-6 ${
                                        format === 'excel' ? 'text-blue-600' : 'text-gray-400'
                                    }`} />
                                    <div className="text-left">
                                        <div className="font-medium">Excel</div>
                                        <div className="text-sm text-gray-500">Formato .xlsx</div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormat('csv')}
                                    className={`flex items-center gap-3 p-4 border rounded-lg ${
                                        format === 'csv'
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <FileText className={`h-6 w-6 ${
                                        format === 'csv' ? 'text-blue-600' : 'text-gray-400'
                                    }`} />
                                    <div className="text-left">
                                        <div className="font-medium">CSV</div>
                                        <div className="text-sm text-gray-500">Formato .csv</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Período */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Período
                            </label>
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="w-full rounded-lg border-gray-300"
                            >
                                <option value="month">Este Mês</option>
                                <option value="quarter">Este Trimestre</option>
                                <option value="year">Este Ano</option>
                                <option value="custom">Período Personalizado</option>
                            </select>
                        </div>

                        {/* Campos a Incluir */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Campos a Incluir
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(includeFields).map(([field, included]) => (
                                    <label key={field} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={included}
                                            onChange={() => setIncludeFields(prev => ({
                                                ...prev,
                                                [field]: !prev[field]
                                            }))}
                                            className="rounded border-gray-300 text-blue-600"
                                        />
                                        <span className="text-sm text-gray-700">
                                            {field.charAt(0).toUpperCase() + field.slice(1)}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <Download className="h-5 w-5" />
                            Exportar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
