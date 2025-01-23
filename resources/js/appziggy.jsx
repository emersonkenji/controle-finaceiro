import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import route from 'ziggy-js';

// Configuração do nome da aplicação
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Configuração global do Ziggy
window.route = route;

// Configuração do Progress Bar
const progress = {
    // O delay antes de mostrar o progress bar
    delay: 250,

    // A cor do progress bar
    color: '#4B5563',

    // Se deve incluir o spinner
    includeSpinner: true,

    // Se deve mostrar o progress bar quando navegar na mesma página
    showSpinner: true,
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,

    resolve: (name) => resolvePageComponent(
        `./Pages/${name}.jsx`,
        import.meta.glob('./Pages/**/*.jsx')
    ),

    setup({ el, App, props }) {
        const root = createRoot(el);

        // Adiciona tratamento de erros global
        const ErrorBoundary = ({ children }) => {
            try {
                return children;
            } catch (error) {
                console.error('Erro na aplicação:', error);
                return <div>Ocorreu um erro inesperado.</div>;
            }
        };

        root.render(
            <ErrorBoundary>
                <App {...props} />
            </ErrorBoundary>
        );
    },

    progress,
});
