import { Link } from '@inertiajs/react';
import {
    Store,
    ShoppingCart,
    Users,
    DollarSign,
    UserCog,
    Truck,
    BarChart3,
    Settings,
    ChevronDown,
    ChevronRight,
    Calculator,
    ClipboardList,
    Building2,
    CreditCard,
    Wallet,
    LineChart,
    LayoutDashboard,
    FileText,
    Package,
    History,
    BadgeDollarSign,
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    ChartPie,
    Receipt,
    Box,
    Star,
    Database,
    FileBarChart,
    CheckCircle,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const menuItems = [
    {
        title: 'Clientes',
        icon: Users,
        submenu: [
            { title: 'Lista de Clientes', route: 'customers.index', icon: ClipboardList },
            { title: 'Novo Cliente', route: 'customers.create', icon: Users },
            { title: 'Categorias', route: 'customers.categories.index', icon: Building2 }
        ]
    },
    {
        title: 'Produtos',
        icon: Package,
        submenu: [
            { title: 'Lista de Produtos', route: 'products.index', icon: ClipboardList },
            { title: 'Novo Produto', route: 'products.create', icon: Package },
            { title: 'Categorias', route: 'products.categories.index', icon: Building2 },
            { title: 'Alertas de Estoque', route: 'products.stock.alerts', icon: History }
        ]
    },
    {
        title: 'Vendas',
        icon: Store,
        submenu: [
            { title: 'PDV', route: 'pdv.index', icon: Calculator },
            { title: 'Lista de Vendas', route: 'orders.index', icon: ClipboardList },
            { title: 'Nova Venda', route: 'orders.create', icon: ShoppingCart }
        ]
    },
    {
        title: 'Financeiro',
        icon: BarChart3,
        submenu: [
            { title: 'Dashboard', route: 'financial.dashboard', icon: BarChart3 },
            { title: 'Contas a Receber', route: 'financial.receivables.index', icon: ArrowDown },
            { title: 'Contas a Pagar', route: 'financial.payables.index', icon: ArrowUp },
            { title: 'Fluxo de Caixa', route: 'financial.cash-flow', icon: ArrowUpDown },
            { title: 'DRE', route: 'financial.dre', icon: FileBarChart },
            { title: 'Conciliação Bancária', route: 'financial.bank-reconciliation.index', icon: CheckCircle },
            { title: 'Centro de Custos', route: 'financial.cost-centers.index', icon: Building2 }
        ]
    },
    {
        title: 'Funcionários',
        icon: UserCog,
        submenu: [
            { title: 'Lista de Funcionários', route: 'employees.index', icon: ClipboardList },
            { title: 'Novo Funcionário', route: 'employees.create', icon: UserCog },
            { title: 'Comissões', route: 'employees.commissions.index', icon: DollarSign }
        ]
    },
    {
        title: 'Logística',
        icon: Box,
        submenu: [
            { title: 'Entregas', route: 'logistics.deliveries.index', icon: Box },
            { title: 'Transportadoras', route: 'logistics.carriers.index', icon: Star }
        ]
    },
    {
        title: 'Relatórios',
        icon: Receipt,
        submenu: [
            { title: 'Vendas', route: 'reports.sales.index', icon: Receipt },
            { title: 'Financeiro', route: 'reports.financial.index', icon: BarChart3 },
            { title: 'Estoque', route: 'reports.inventory.index', icon: Box },
            { title: 'Clientes', route: 'reports.customers.index', icon: Users },
            { title: 'Produtos', route: 'reports.products.index', icon: Box }
        ]
    },
    {
        title: 'Configurações',
        icon: Settings,
        submenu: [
            { title: 'Geral', route: 'settings.general.index', icon: Settings },
            { title: 'Empresa', route: 'settings.company.index', icon: Building2 },
            { title: 'Usuários', route: 'settings.users.index', icon: Users },
            { title: 'Backup', route: 'settings.backup.index', icon: Database }
        ]
    }
];

export default function Sidebar() {
    const [openMenus, setOpenMenus] = useState({});

    const toggleMenu = (title) => {
        setOpenMenus(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    return (
        <aside className="w-64 min-h-screen bg-white border-r">
            <nav className="p-4">
                {menuItems.map((item) => (
                    <div key={item.title} className="mb-2">
                        <button
                            onClick={() => toggleMenu(item.title)}
                            className={cn(
                                'flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100',
                                openMenus[item.title] && 'bg-gray-100'
                            )}
                        >
                            <div className="flex items-center">
                                {item.icon && <item.icon className="w-5 h-5 mr-2" />}
                                <span>{item.title}</span>
                            </div>
                            <ChevronDown className={cn(
                                'w-4 h-4 transition-transform',
                                openMenus[item.title] && 'transform rotate-180'
                            )} />
                        </button>

                        {openMenus[item.title] && item.submenu && (
                            <div className="pl-4 mt-2 space-y-1">
                                {item.submenu.map((subItem) => (
                                    <Link
                                        key={subItem.route}
                                        href={route(subItem.route)}
                                        className="flex items-center px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100"
                                    >
                                        {subItem.icon && <subItem.icon className="w-4 h-4 mr-2" />}
                                        <span>{subItem.title}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
}
