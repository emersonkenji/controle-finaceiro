import { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingCart,
    DollarSign,
    UserCog,
    Truck,
    FileText,
    Settings,
    ChevronDown,
    ChevronRight,
    PieChart,
    Wallet,
    CreditCard,
    TrendingUp,
    BarChart2,
    PiggyBank,
    Building2,
    Target,
    Calendar,
    Bell,
    Search,
    Database,
    Cog
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [openMenus, setOpenMenus] = useState({});

    const toggleMenu = (menu) => {
        setOpenMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        {
            name: 'Clientes',
            icon: Users,
            submenu: [
                { name: 'Lista de Clientes', href: '/customers', icon: Users },
                { name: 'Categorias', href: '/customers/categories', icon: PieChart },
                { name: 'Histórico', href: '/customers/history', icon: FileText }
            ]
        },
        {
            name: 'Produtos',
            icon: Package,
            submenu: [
                { name: 'Catálogo', href: '/products', icon: Package },
                { name: 'Categorias', href: '/products/categories', icon: PieChart },
                { name: 'Estoque', href: '/products/stock', icon: Database },
                { name: 'Movimentações', href: '/products/movements', icon: TrendingUp }
            ]
        },
        {
            name: 'Vendas',
            icon: ShoppingCart,
            submenu: [
                { name: 'PDV', href: '/sales/pos', icon: ShoppingCart },
                { name: 'Pedidos', href: '/sales/orders', icon: FileText },
                { name: 'Orçamentos', href: '/sales/quotes', icon: FileText },
                { name: 'Comissões', href: '/sales/commissions', icon: Target }
            ]
        },
        {
            name: 'Financeiro',
            icon: DollarSign,
            submenu: [
                { name: 'Visão Geral', href: '/financial', icon: PieChart },
                { name: 'Contas a Receber', href: '/financial/receivables', icon: Wallet },
                { name: 'Contas a Pagar', href: '/financial/payables', icon: CreditCard },
                { name: 'Fluxo de Caixa', href: '/financial/cash-flow', icon: TrendingUp },
                { name: 'DRE', href: '/financial/dre', icon: BarChart2 },
                { name: 'Conciliação', href: '/financial/reconciliation', icon: PiggyBank },
                { name: 'Centro de Custos', href: '/financial/cost-center', icon: Building2 }
            ]
        },
        {
            name: 'Funcionários',
            icon: UserCog,
            submenu: [
                { name: 'Lista', href: '/employees', icon: Users },
                { name: 'Ponto', href: '/employees/time-clock', icon: Calendar },
                { name: 'Documentos', href: '/employees/documents', icon: FileText },
                { name: 'Metas', href: '/employees/goals', icon: Target }
            ]
        },
        {
            name: 'Logística',
            icon: Truck,
            submenu: [
                { name: 'Entregas', href: '/logistics/deliveries', icon: Truck },
                { name: 'Roteirização', href: '/logistics/routes', icon: Target },
                { name: 'Zonas', href: '/logistics/zones', icon: PieChart },
                { name: 'Custos', href: '/logistics/costs', icon: DollarSign }
            ]
        },
        {
            name: 'Relatórios',
            icon: FileText,
            submenu: [
                { name: 'Vendas', href: '/reports/sales', icon: ShoppingCart },
                { name: 'Financeiro', href: '/reports/financial', icon: DollarSign },
                { name: 'Estoque', href: '/reports/stock', icon: Package },
                { name: 'Clientes', href: '/reports/customers', icon: Users },
                { name: 'Personalizado', href: '/reports/custom', icon: FileText }
            ]
        },
        {
            name: 'Configurações',
            icon: Settings,
            submenu: [
                { name: 'Empresa', href: '/settings/company', icon: Building2 },
                { name: 'Usuários', href: '/settings/users', icon: Users },
                { name: 'Integrações', href: '/settings/integrations', icon: Cog },
                { name: 'Notificações', href: '/settings/notifications', icon: Bell },
                { name: 'Backup', href: '/settings/backup', icon: Database }
            ]
        }
    ];

    return (
        <aside className={cn(
            "h-screen bg-white border-r border-gray-200 transition-all duration-300",
            collapsed ? "w-20" : "w-64"
        )}>
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    {!collapsed && <span className="text-lg font-semibold">Menu</span>}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-1.5 rounded-lg hover:bg-gray-100"
                    >
                        {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <nav className="p-2 space-y-1">
                        {navigation.map((item) => (
                            <div key={item.name}>
                                {item.submenu ? (
                                    <>
                                        <button
                                            onClick={() => toggleMenu(item.name)}
                                            className={cn(
                                                "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                                                openMenus[item.name] ? "bg-gray-100" : "hover:bg-gray-50"
                                            )}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            {!collapsed && (
                                                <>
                                                    <span className="flex-1 text-left">{item.name}</span>
                                                    <ChevronDown
                                                        className={cn(
                                                            "h-4 w-4 transition-transform",
                                                            openMenus[item.name] && "transform rotate-180"
                                                        )}
                                                    />
                                                </>
                                            )}
                                        </button>
                                        {openMenus[item.name] && !collapsed && (
                                            <div className="mt-1 ml-4 space-y-1">
                                                {item.submenu.map((subitem) => (
                                                    <Link
                                                        key={subitem.href}
                                                        href={subitem.href}
                                                        className={cn(
                                                            "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                                                            route().current(subitem.href)
                                                                ? "bg-gray-100 text-gray-900"
                                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                        )}
                                                    >
                                                        <subitem.icon className="h-4 w-4" />
                                                        <span>{subitem.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                                            route().current(item.href)
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {!collapsed && <span>{item.name}</span>}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>

                {!collapsed && (
                    <div className="p-4 border-t border-gray-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
