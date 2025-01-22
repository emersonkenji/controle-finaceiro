import { useState } from 'react';
import { X } from 'lucide-react';

export default function ExpenseFormModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        description: '',
        department: '',
        category: '',
        amount: '',
        date: '',
        notes: '',
        attachments: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-lg font-medium">Nova Despesa</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        {/* Descrição */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descrição
                            </label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full rounded-lg border-gray-300"
                                required
                            />
                        </div>

                        {/* Departamento e Categoria */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Departamento
                                </label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300"
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Comercial">Comercial</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Administrativo">Administrativo</option>
                                    <option value="TI">TI</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Categoria
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300"
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Materiais">Materiais</option>
                                    <option value="Serviços">Serviços</option>
                                    <option value="Software">Software</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Outros">Outros</option>
                                </select>
                            </div>
                        </div>

                        {/* Valor e Data */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Valor
                                </label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Data
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300"
                                    required
                                />
                            </div>
                        </div>

                        {/* Observações */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Observações
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={3}
                                className="w-full rounded-lg border-gray-300"
                            />
                        </div>

                        {/* Anexos */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Anexos
                            </label>
                            <input
                                type="file"
                                name="attachments"
                                multiple
                                className="w-full"
                                onChange={(e) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        attachments: Array.from(e.target.files)
                                    }));
                                }}
                            />
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
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
