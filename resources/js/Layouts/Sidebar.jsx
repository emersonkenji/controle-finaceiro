import {
    ArrowDownIcon,
    ArrowUpIcon,
    ArrowsRightLeftIcon,
    BanknotesIcon,
    BuildingOfficeIcon,
    ChartBarIcon,
    CheckCircleIcon,
    DocumentChartBarIcon,
} from '@heroicons/react/24/outline';

const navigation = [
    // ... existing navigation items ...
    {
        name: 'Financeiro',
        icon: BanknotesIcon,
        children: [
            {
                name: 'Dashboard',
                href: route('financial.dashboard'),
                icon: ChartBarIcon,
            },
            {
                name: 'Contas a Receber',
                href: route('financial.receivables.index'),
                icon: ArrowDownIcon,
            },
            {
                name: 'Contas a Pagar',
                href: route('financial.payables.index'),
                icon: ArrowUpIcon,
            },
            {
                name: 'Fluxo de Caixa',
                href: route('financial.cash-flow'),
                icon: ArrowsRightLeftIcon,
            },
            {
                name: 'DRE',
                href: route('financial.dre'),
                icon: DocumentChartBarIcon,
            },
            {
                name: 'Conciliação Bancária',
                href: route('financial.bank-reconciliation.index'),
                icon: CheckCircleIcon,
            },
            {
                name: 'Centro de Custos',
                href: route('financial.cost-centers.index'),
                icon: BuildingOfficeIcon,
            },
        ],
    },
    // ... existing navigation items ...
];
