import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Registrando os componentes necessários do Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Opções padrão para todos os gráficos
const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                    size: 12
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
                size: 14
            },
            bodyFont: {
                size: 13
            },
            cornerRadius: 4,
            displayColors: true
        }
    }
};

// Cores padrão para os gráficos
const defaultColors = {
    primary: 'rgb(59, 130, 246)', // blue-600
    secondary: 'rgb(107, 114, 128)', // gray-500
    success: 'rgb(34, 197, 94)', // green-500
    danger: 'rgb(239, 68, 68)', // red-500
    warning: 'rgb(234, 179, 8)', // yellow-500
    info: 'rgb(6, 182, 212)', // cyan-500
};

// Função para criar gradientes
const createGradient = (ctx, color) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color.replace(')', ', 0.4)').replace('rgb', 'rgba'));
    gradient.addColorStop(1, color.replace(')', ', 0.0)').replace('rgb', 'rgba'));
    return gradient;
};

export default function FinancialChart({ type, data, options = {}, height = 300 }) {
    const chartRef = React.useRef(null);
    const [chartData, setChartData] = React.useState(null);

    React.useEffect(() => {
        if (!chartRef.current) return;

        const chart = chartRef.current;
        const ctx = chart.ctx;

        // Preparando os dados com gradientes para gráficos de linha e barra
        if (type === 'line' || type === 'bar') {
            const datasets = data.datasets.map(dataset => ({
                ...dataset,
                backgroundColor: dataset.useGradient
                    ? createGradient(ctx, dataset.borderColor || defaultColors.primary)
                    : dataset.backgroundColor,
            }));

            setChartData({
                ...data,
                datasets
            });
        } else {
            setChartData(data);
        }
    }, [data, type]);

    if (!chartData) return null;

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        plugins: {
            ...defaultOptions.plugins,
            ...options.plugins
        }
    };

    const props = {
        ref: chartRef,
        options: mergedOptions,
        data: chartData,
        height: height
    };

    switch (type) {
        case 'line':
            return <Line {...props} />;
        case 'bar':
            return <Bar {...props} />;
        case 'pie':
            return <Pie {...props} />;
        default:
            return null;
    }
}
