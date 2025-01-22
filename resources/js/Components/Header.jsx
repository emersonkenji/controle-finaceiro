import { Link } from '@inertiajs/react';
import {
    Bell,
    Search,
    User,
    LogOut,
    Settings,
    ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Header({ user }) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <header className="bg-white border-b shadow-sm">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold text-gray-800">
                            Sistema
                        </Link>
                    </div>

                    {/* Barra de Pesquisa */}
                    <div className="flex-1 max-w-xl">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Pesquisar..."
                                className="w-full px-4 py-2 pl-10 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                        </div>
                    </div>

                    {/* Menu do Usuário */}
                    <div className="flex items-center space-x-4">
                        {/* Notificações */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-1 text-gray-600 rounded-full hover:bg-gray-100"
                            >
                                <Bell className="w-6 h-6" />
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 z-50 w-80 mt-2 overflow-hidden bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                    <div className="p-4">
                                        <h3 className="text-sm font-medium text-gray-900">Notificações</h3>
                                        <div className="mt-2 space-y-2">
                                            {/* Lista de notificações aqui */}
                                            <p className="text-sm text-gray-500">Nenhuma notificação no momento.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Perfil */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-3 text-gray-700 transition duration-150 ease-in-out"
                            >
                                <div className="w-8 h-8 overflow-hidden bg-gray-200 rounded-full">
                                    <User className="w-full h-full p-1" />
                                </div>
                                <span className="text-sm font-medium">{user?.name}</span>
                                <ChevronDown className={cn(
                                    "w-4 h-4 transition-transform",
                                    showUserMenu && "transform rotate-180"
                                )} />
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 z-50 w-48 py-1 mt-2 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                    <Link
                                        href={route('profile.edit')}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        Perfil
                                    </Link>
                                    <Link
                                        href={route('settings.index')}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <Settings className="w-4 h-4 mr-2" />
                                        Configurações
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Sair
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
