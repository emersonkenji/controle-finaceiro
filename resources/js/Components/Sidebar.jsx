import { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingCart,
    Wallet,
    Users2,
    Truck,
    FileText,
    Settings,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', route: 'dashboard' },
        { icon: Users, label: 'Clientes', route: 'clients' },
        { icon: Package, label: 'Produtos', route: 'products' },
        { icon: ShoppingCart, label: 'Vendas', route: 'sales' },
        { icon: Wallet, label: 'Financeiro', route: 'financial' },
        { icon: Users2, label: 'Funcionários', route: 'employees' },
        { icon: Truck, label: 'Logística', route: 'logistics' },
        { icon: FileText, label: 'Relatórios', route: 'reports' },
        { icon: Settings, label: 'Configurações', route: 'settings' },
    ];

    return (
        <div
            className={`bg-white h-screen transition-all duration-300 ease-in-out border-r ${
                collapsed ? 'w-16' : 'w-64'
            }`}
        >
            <div className="flex justify-end p-4">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                >
                    {collapsed ? (
                        <ChevronRight className="h-5 w-5" />
                    ) : (
                        <ChevronLeft className="h-5 w-5" />
                    )}
                </button>
            </div>

            <nav className="mt-4">
                {menuItems.map((item, index) => (
                    <Link
                        key={index}
                        href={route(item.route)}
                        className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
                            route().current(item.route) ? 'bg-gray-100' : ''
                        }`}
                    >
                        <item.icon className="h-5 w-5" />
                        {!collapsed && (
                            <span className="ml-3">{item.label}</span>
                        )}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
