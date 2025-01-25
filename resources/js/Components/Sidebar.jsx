import { Link } from "@inertiajs/react";
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
    Search,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigation = [
    { title: 'Dashboard', route: "dashboard", icon: LayoutDashboard },
    {
        title: "Clientes",
        icon: Users,
        submenu: [
            {
                title: "Lista de Clientes",
                route: "customers.index",
                icon: ClipboardList,
            },
            { title: "Novo Cliente", route: "customers.create", icon: Users },
            {
                title: "Categorias",
                route: "customers.categories.index",
                icon: Building2,
            },
        ],
    },
    {
        title: "Produtos",
        icon: Package,
        submenu: [
            {
                title: "Lista de Produtos",
                route: "products.index",
                icon: ClipboardList,
            },
            { title: "Novo Produto", route: "products.create", icon: Package },
            {
                title: "Categorias",
                route: "products.categories.index",
                icon: Building2,
            },
            {
                title: "Alertas de Estoque",
                route: "products.stock.alerts",
                icon: History,
            },
        ],
    },
    {
        title: "Vendas",
        icon: Store,
        submenu: [
            { title: "PDV", route: "pdv.index", icon: Calculator },
            {
                title: "Lista de Vendas",
                route: "orders.index",
                icon: ClipboardList,
            },
            { title: "Nova Venda", route: "orders.create", icon: ShoppingCart },
        ],
    },
    {
        title: "Financeiro",
        icon: BarChart3,
        submenu: [
            {
                title: "Dashboard",
                route: "financial.dashboard",
                icon: BarChart3,
            },
            {
                title: "Contas a Receber",
                route: "financial.receivables.index",
                icon: ArrowDown,
            },
            {
                title: "Contas a Pagar",
                route: "financial.payables.index",
                icon: ArrowUp,
            },
            {
                title: "Fluxo de Caixa",
                route: "financial.cash-flow",
                icon: ArrowUpDown,
            },
            { title: "DRE", route: "financial.dre", icon: FileBarChart },
            {
                title: "Conciliação Bancária",
                route: "financial.bank-reconciliation.index",
                icon: CheckCircle,
            },
            {
                title: "Centro de Custos",
                route: "financial.cost-centers.index",
                icon: Building2,
            },
        ],
    },
    {
        title: "Funcionários",
        icon: UserCog,
        submenu: [
            {
                title: "Lista de Funcionários",
                route: "employees.index",
                icon: ClipboardList,
            },
            {
                title: "Novo Funcionário",
                route: "employees.create",
                icon: UserCog,
            },
            {
                title: "Comissões",
                route: "employees.commissions.index",
                icon: DollarSign,
            },
        ],
    },
    {
        title: "Logística",
        icon: Box,
        submenu: [
            {
                title: "Entregas",
                route: "logistics.deliveries.index",
                icon: Box,
            },
            {
                title: "Transportadoras",
                route: "logistics.carriers.index",
                icon: Star,
            },
        ],
    },
    {
        title: "Relatórios",
        icon: Receipt,
        submenu: [
            { title: "Vendas", route: "reports.sales.index", icon: Receipt },
            {
                title: "Financeiro",
                route: "reports.financial.index",
                icon: BarChart3,
            },
            { title: "Estoque", route: "reports.inventory.index", icon: Box },
            {
                title: "Clientes",
                route: "reports.customers.index",
                icon: Users,
            },
            { title: "Produtos", route: "reports.products.index", icon: Box },
        ],
    },
    {
        title: "Configurações",
        icon: Settings,
        submenu: [
            { title: "Geral", route: "settings.general.index", icon: Settings },
            {
                title: "Empresa",
                route: "settings.company.index",
                icon: Building2,
            },
            { title: "Usuários", route: "settings.users.index", icon: Users },
            { title: "Backup", route: "settings.backup.index", icon: Database },
        ],
    },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [openMenus, setOpenMenus] = useState({});

    const toggleMenu = (title) => {
        setOpenMenus((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    return (
        <aside
            className={cn(
                "h-screen bg-white border-r border-gray-200 transition-all duration-300",
                collapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    {!collapsed && (
                        <span className="text-lg font-semibold">Menu</span>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-1.5 rounded-lg hover:bg-gray-100"
                    >
                        {collapsed ? (
                            <ChevronRight className="w-5 h-5 m-[3px]" />
                        ) : (
                            <ChevronDown className="w-5 h-5 m-[3px]" />
                        )}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <nav className="p-2 space-y-1">
                        {navigation.map((item) => (
                            <div key={item.title}>
                                {item.submenu ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                toggleMenu(item.title);
                                                if (collapsed) {
                                                    setCollapsed(false);
                                                }
                                            }}
                                            // onClick={() => toggleMenu(item.title) setCollapsed(!collapsed)}
                                            className={cn(
                                                "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                                                openMenus[item.title]
                                                    ? "bg-gray-100"
                                                    : "hover:bg-gray-50"
                                            )}
                                        >
                                            <item.icon
                                                className={cn(
                                                    "transition-transform",
                                                    collapsed
                                                        ? "w-5 h-5 mx-auto"
                                                        : "w-5 h-5"
                                                )}
                                            />
                                            {!collapsed && (
                                                <>
                                                    <span className="flex-1 text-left">
                                                        {item.title}
                                                    </span>
                                                    <ChevronDown
                                                        className={cn(
                                                            "h-4 w-4 transition-transform",
                                                            openMenus[
                                                                item.title
                                                            ] &&
                                                                "transform rotate-180"
                                                        )}
                                                    />
                                                </>
                                            )}
                                        </button>
                                        {/* {submenus} */}
                                        {openMenus[item.title] &&
                                            !collapsed && (
                                                <div className="mt-1 ml-4 space-y-1">
                                                    {item.submenu.map(
                                                        (subitem) => (
                                                            <Link
                                                                key={
                                                                    subitem.route
                                                                }
                                                                href={route(
                                                                    subitem.route
                                                                )}
                                                                className={cn(
                                                                    "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                                                                    route().current(
                                                                        subitem.route
                                                                    )
                                                                        ? "bg-gray-100 text-gray-900"
                                                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                                )}
                                                            >
                                                                <subitem.icon className="w-4 h-4" />
                                                                <span>
                                                                    {
                                                                        subitem.title
                                                                    }
                                                                </span>
                                                            </Link>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                    </>
                                ) : (
                                    <Link
                                        href={route(item.route)}
                                        onClick={() => setCollapsed(collapsed)}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                                            route().current(item.route)
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        )}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {!collapsed && (
                                            <span>{item.title}</span>
                                        )}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>

                {!collapsed && (
                    <div className="p-4 border-t border-gray-200">
                        <div className="relative">
                            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="w-full py-2 pr-4 text-sm border border-gray-300 rounded-lg pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
