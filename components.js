import { execSync } from 'child_process';

const components = [
    'button',
    'input',
    'select',
    'card',
    'tabs',
    'form',
    'table',
    'dropdown-menu'
];

components.forEach(component => {
    try {
        console.log(`Installing ${component}...`);
        execSync(`npx shadcn-ui@latest add ${component} --yes`, { stdio: 'inherit' });
        console.log(`✅ ${component} installed successfully\n`);
    } catch (error) {
        console.error(`❌ Error installing ${component}:`, error);
    }
});
