import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    Download,
    Filter,
    Calendar,
    TrendingUp,
    DollarSign,
    Percent,
    BarChart3,
    ArrowDown,
    ArrowUp
} from 'lucide-react';
import FinancialChart from '@/Components/Charts/FinancialChart';

export default function DREIndex() {
    const [period, setPeriod] = useState('month');

    // Dados de exemplo - posteriormente virão do backend
    const dreData = {
        receitaBruta: 150000.00,
        deducoes: 15000.00,
        receitaLiquida: 135000.00,
        custosProdutos: 60000.00,
        lucroBruto: 75000.00,
        despesasOperacionais: 35000.00,
        resultadoOperacional: 40000.00,
        resultadoFinanceiro: -5000.00,
        resultadoAntesIR: 35000.00,
        impostoRenda: 5250.00,
        lucroLiquido: 29750.00,
        margemLiquida: 19.83
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
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value / 100);
    };

    const getPercentageChange = (value, total) => {
        return (value / total) * 100;
    };

    // Dados para o gráfico de evolução dos resultados
    const evolutionData = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [
            {
                label: 'Receita Bruta',
                data: [120000, 130000, 140000, 145000, 150000, 155000],
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 2,
                tension: 0.4,
                useGradient: true
            },
            {
                label: 'Lucro Bruto',
                data: [60000, 65000, 70000, 72000, 75000, 78000],
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 2,
                tension: 0.4,
                useGradient: true
            },
            {
                label: 'Lucro Líquido',
                data: [25000, 27000, 28000, 29000, 29750, 31000],
                borderColor: 'rgb(234, 179, 8)',
                borderWidth: 2,
                tension: 0.4,
                useGradient: true
            }
        ]
    };

    // Dados para o gráfico de composição do resultado
    const compositionData = {
        labels: ['Receita Bruta', 'Deduções', 'Custos', 'Despesas Op.', 'Resultado Fin.', 'IR', 'Lucro Líquido'],
        datasets: [{
            data: [
                dreData.receitaBruta,
                -dreData.deducoes,
                -dreData.custosProdutos,
                -dreData.despesasOperacionais,
                dreData.resultadoFinanceiro,
                -dreData.impostoRenda,
                dreData.lucroLiquido
            ],
            backgroundColor: [
                'rgb(34, 197, 94)',  // green-500
                'rgb(239, 68, 68)',  // red-500
                'rgb(239, 68, 68)',  // red-500
                'rgb(239, 68, 68)',  // red-500
                dreData.resultadoFinanceiro >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
                'rgb(239, 68, 68)',  // red-500
                'rgb(59, 130, 246)', // blue-600
            ]
        }]
    };

    // Opções para o gráfico de evolução
    const evolutionOptions = {
        plugins: {
            title: {
                display: true,
                text: 'Evolução dos Resultados',
                padding: {
                    top: 10,
                    bottom: 30
                }
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
    };

    // Opções para o gráfico de composição
    const compositionOptions = {
        plugins: {
            title: {
                display: true,
                text: 'Composição do Resultado',
                padding: {
                    top: 10,
                    bottom: 30
                }
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
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        DRE - Demonstrativo de Resultados
                    </h2>
                    <div className="flex items-center gap-4">
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="rounded-lg border-gray-300 text-sm"
                        >
                            <option value="month">Este Mês</option>
                            <option value="quarter">Este Trimestre</option>
                            <option value="year">Este Ano</option>
                            <option value="custom">Período Personalizado</option>
                        </select>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                            <Filter className="h-5 w-5 text-gray-500" />
                            Filtros
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                            <Download className="h-5 w-5 text-gray-500" />
                            Exportar
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="DRE" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Cards de Resumo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <DollarSign className="h-5 w-5 text-gray-400" />
                                <h3 className="text-sm font-medium text-gray-500">Receita Bruta</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(dreData.receitaBruta)}
                            </p>
                            <div className="mt-2 flex items-center text-sm">
                                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-500 font-medium">12%</span>
                                <span className="text-gray-500 ml-2">vs mês anterior</span>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp className="h-5 w-5 text-gray-400" />
                                <h3 className="text-sm font-medium text-gray-500">Lucro Bruto</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(dreData.lucroBruto)}
                            </p>
                            <div className="mt-2 flex items-center text-sm">
                                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-500 font-medium">8%</span>
                                <span className="text-gray-500 ml-2">vs mês anterior</span>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <DollarSign className="h-5 w-5 text-gray-400" />
                                <h3 className="text-sm font-medium text-gray-500">Lucro Líquido</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(dreData.lucroLiquido)}
                            </p>
                            <div className="mt-2 flex items-center text-sm">
                                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-500 font-medium">15%</span>
                                <span className="text-gray-500 ml-2">vs mês anterior</span>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Percent className="h-5 w-5 text-gray-400" />
                                <h3 className="text-sm font-medium text-gray-500">Margem Líquida</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatPercent(dreData.margemLiquida)}
                            </p>
                            <div className="mt-2 flex items-center text-sm">
                                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-500 font-medium">2.5pp</span>
                                <span className="text-gray-500 ml-2">vs mês anterior</span>
                            </div>
                        </div>
                    </div>

                    {/* DRE Detalhado */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Demonstrativo Detalhado</h3>
                            <div className="space-y-4">
                                <div className="border-b pb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">Receita Bruta</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-gray-500">{formatPercent(100)}</span>
                                            <span className="font-medium">{formatCurrency(dreData.receitaBruta)}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-gray-500 pl-4">
                                        <span>(-) Deduções</span>
                                        <div className="flex items-center gap-4">
                                            <span>{formatPercent(getPercentageChange(dreData.deducoes, dreData.receitaBruta))}</span>
                                            <span>{formatCurrency(dreData.deducoes)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-b pb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">Receita Líquida</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-gray-500">{formatPercent(getPercentageChange(dreData.receitaLiquida, dreData.receitaBruta))}</span>
                                            <span className="font-medium">{formatCurrency(dreData.receitaLiquida)}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-gray-500 pl-4">
                                        <span>(-) Custos dos Produtos/Serviços</span>
                                        <div className="flex items-center gap-4">
                                            <span>{formatPercent(getPercentageChange(dreData.custosProdutos, dreData.receitaBruta))}</span>
                                            <span>{formatCurrency(dreData.custosProdutos)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-b pb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">Lucro Bruto</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-gray-500">{formatPercent(getPercentageChange(dreData.lucroBruto, dreData.receitaBruta))}</span>
                                            <span className="font-medium">{formatCurrency(dreData.lucroBruto)}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-gray-500 pl-4">
                                        <span>(-) Despesas Operacionais</span>
                                        <div className="flex items-center gap-4">
                                            <span>{formatPercent(getPercentageChange(dreData.despesasOperacionais, dreData.receitaBruta))}</span>
                                            <span>{formatCurrency(dreData.despesasOperacionais)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-b pb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">Resultado Operacional</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-gray-500">{formatPercent(getPercentageChange(dreData.resultadoOperacional, dreData.receitaBruta))}</span>
                                            <span className="font-medium">{formatCurrency(dreData.resultadoOperacional)}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-gray-500 pl-4">
                                        <span>(+/-) Resultado Financeiro</span>
                                        <div className="flex items-center gap-4">
                                            <span>{formatPercent(getPercentageChange(dreData.resultadoFinanceiro, dreData.receitaBruta))}</span>
                                            <span>{formatCurrency(dreData.resultadoFinanceiro)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-b pb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">Resultado Antes do IR</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-gray-500">{formatPercent(getPercentageChange(dreData.resultadoAntesIR, dreData.receitaBruta))}</span>
                                            <span className="font-medium">{formatCurrency(dreData.resultadoAntesIR)}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-gray-500 pl-4">
                                        <span>(-) Imposto de Renda</span>
                                        <div className="flex items-center gap-4">
                                            <span>{formatPercent(getPercentageChange(dreData.impostoRenda, dreData.receitaBruta))}</span>
                                            <span>{formatCurrency(dreData.impostoRenda)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-lg">Lucro Líquido</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-gray-500">{formatPercent(getPercentageChange(dreData.lucroLiquido, dreData.receitaBruta))}</span>
                                            <span className="font-medium text-lg">{formatCurrency(dreData.lucroLiquido)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gráficos de Análise */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="h-80">
                                <FinancialChart
                                    type="line"
                                    data={evolutionData}
                                    options={evolutionOptions}
                                />
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="h-80">
                                <FinancialChart
                                    type="bar"
                                    data={compositionData}
                                    options={compositionOptions}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
