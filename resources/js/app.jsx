import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Configuração do Progress Bar
const progress = {
    delay: 250,
    color: '#4B5563',
    includeSpinner: true,
    showSpinner: true,
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
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
