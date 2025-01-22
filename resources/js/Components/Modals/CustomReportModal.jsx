import { useState } from 'react';
import { X, Plus, Trash2, MoveUp, MoveDown, Filter } from 'lucide-react';

export default function CustomReportModal({ isOpen, onClose, onGenerate }) {
    const [reportName, setReportName] = useState('');
    const [columns, setColumns] = useState([
        { id: 'date', label: 'Data', show: true },
        { id: 'description', label: 'Descrição', show: true },
        { id: 'department', label: 'Departamento', show: true },
        { id: 'category', label: 'Categoria', show: true },
        { id: 'amount', label: 'Valor', show: true },
        { id: 'status', label: 'Status', show: true }
    ]);

    const [filters, setFilters] = useState([
        { id: 1, field: '', operator: 'equals', value: '' }
    ]);

    const [groupBy, setGroupBy] = useState([]);
    const [sortBy, setSortBy] = useState({ field: 'date', direction: 'desc' });

    const operators = {
        equals: 'Igual a',
        contains: 'Contém',
        greater: 'Maior que',
        less: 'Menor que',
        between: 'Entre',
        in: 'Em'
    };

    const moveColumn = (index, direction) => {
        const newColumns = [...columns];
        const temp = newColumns[index];
        newColumns[index] = newColumns[index + direction];
        newColumns[index + direction] = temp;
        setColumns(newColumns);
    };

    const toggleColumn = (index) => {
        const newColumns = [...columns];
        newColumns[index].show = !newColumns[index].show;
        setColumns(newColumns);
    };

    const addFilter = () => {
        const newFilter = {
            id: filters.length + 1,
            field: '',
            operator: 'equals',
            value: ''
        };
        setFilters([...filters, newFilter]);
    };

    const removeFilter = (id) => {
        setFilters(filters.filter(filter => filter.id !== id));
    };

    const updateFilter = (id, field, value) => {
        setFilters(filters.map(filter =>
            filter.id === id ? { ...filter, [field]: value } : filter
        ));
    };

    const toggleGroupBy = (field) => {
        setGroupBy(prev =>
            prev.includes(field)
                ? prev.filter(f => f !== field)
                : [...prev, field]
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
                    <h3 className="text-lg font-medium">Configurar Relatório</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Nome do Relatório */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome do Relatório
                        </label>
                        <input
                            type="text"
                            value={reportName}
                            onChange={(e) => setReportName(e.target.value)}
                            className="w-full rounded-lg border-gray-300"
                            placeholder="Ex: Relatório de Despesas por Departamento"
                        />
                    </div>

                    {/* Colunas */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-4">Colunas e Ordem</h4>
                        <div className="space-y-2">
                            {columns.map((column, index) => (
                                <div key={column.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                    <input
                                        type="checkbox"
                                        checked={column.show}
                                        onChange={() => toggleColumn(index)}
                                        className="rounded border-gray-300 text-blue-600"
                                    />
                                    <span className="flex-1">{column.label}</span>
                                    <div className="flex items-center gap-2">
                                        {index > 0 && (
                                            <button
                                                onClick={() => moveColumn(index, -1)}
                                                className="p-1 text-gray-400 hover:text-gray-600"
                                            >
                                                <MoveUp className="h-4 w-4" />
                                            </button>
                                        )}
                                        {index < columns.length - 1 && (
                                            <button
                                                onClick={() => moveColumn(index, 1)}
                                                className="p-1 text-gray-400 hover:text-gray-600"
                                            >
                                                <MoveDown className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Filtros */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-medium text-gray-700">Filtros</h4>
                            <button
                                onClick={addFilter}
                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                            >
                                <Plus className="h-4 w-4" />
                                Adicionar Filtro
                            </button>
                        </div>
                        <div className="space-y-4">
                            {filters.map(filter => (
                                <div key={filter.id} className="flex items-center gap-4">
                                    <select
                                        value={filter.field}
                                        onChange={(e) => updateFilter(filter.id, 'field', e.target.value)}
                                        className="rounded-lg border-gray-300"
                                    >
                                        <option value="">Selecione o campo</option>
                                        {columns.map(column => (
                                            <option key={column.id} value={column.id}>
                                                {column.label}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={filter.operator}
                                        onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
                                        className="rounded-lg border-gray-300"
                                    >
                                        {Object.entries(operators).map(([key, label]) => (
                                            <option key={key} value={key}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        value={filter.value}
                                        onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                                        className="flex-1 rounded-lg border-gray-300"
                                        placeholder="Valor"
                                    />
                                    <button
                                        onClick={() => removeFilter(filter.id)}
                                        className="p-2 text-gray-400 hover:text-gray-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Agrupamento */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-4">Agrupar Por</h4>
                        <div className="flex flex-wrap gap-3">
                            {columns.map(column => (
                                <button
                                    key={column.id}
                                    onClick={() => toggleGroupBy(column.id)}
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        groupBy.includes(column.id)
                                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                                            : 'bg-gray-100 text-gray-700 border-gray-200'
                                    } border`}
                                >
                                    {column.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Ordenação */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-4">Ordenar Por</h4>
                        <div className="flex items-center gap-4">
                            <select
                                value={sortBy.field}
                                onChange={(e) => setSortBy(prev => ({ ...prev, field: e.target.value }))}
                                className="rounded-lg border-gray-300"
                            >
                                {columns.map(column => (
                                    <option key={column.id} value={column.id}>
                                        {column.label}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={sortBy.direction}
                                onChange={(e) => setSortBy(prev => ({ ...prev, direction: e.target.value }))}
                                className="rounded-lg border-gray-300"
                            >
                                <option value="asc">Crescente</option>
                                <option value="desc">Decrescente</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t sticky bottom-0 bg-white">
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={() => onGenerate({
                                name: reportName,
                                columns: columns.filter(c => c.show),
                                filters,
                                groupBy,
                                sortBy
                            })}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <Filter className="h-5 w-5" />
                            Gerar Relatório
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
