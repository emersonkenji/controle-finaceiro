import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle, XCircle, Clock, History, DollarSign } from 'lucide-react';

export default function NotificationsMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(3);
    const menuRef = useRef(null);

    // Dados de exemplo - posteriormente virão do backend
    const notifications = [
        {
            id: 1,
            type: 'expense_pending',
            title: 'Nova despesa para aprovação',
            description: 'Campanha Marketing Digital - R$ 3.500,00',
            time: '5 minutos atrás',
            read: false
        },
        {
            id: 2,
            type: 'budget_change',
            title: 'Alteração de orçamento',
            description: 'Marketing: Aumento de R$ 5.000,00',
            time: '1 hora atrás',
            read: false
        },
        {
            id: 3,
            type: 'expense_approved',
            title: 'Despesa aprovada',
            description: 'Material de Escritório - R$ 1.500,00',
            time: '2 horas atrás',
            read: false
        },
        {
            id: 4,
            type: 'expense_rejected',
            title: 'Despesa rejeitada',
            description: 'Equipamentos - R$ 8.000,00',
            time: '1 dia atrás',
            read: true
        }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'expense_pending':
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'expense_approved':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'expense_rejected':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'budget_change':
                return <History className="h-5 w-5 text-blue-500" />;
            default:
                return <DollarSign className="h-5 w-5 text-gray-500" />;
        }
    };

    const markAllAsRead = () => {
        setUnreadCount(0);
        // Aqui você implementará a lógica para marcar todas como lidas no backend
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* Botão de Notificações */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Menu de Notificações */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Notificações</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Marcar todas como lidas
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="divide-y">
                                {notifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-gray-50 ${
                                            !notification.read ? 'bg-blue-50' : ''
                                        }`}
                                    >
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                {getIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {notification.title}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {notification.description}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {notification.time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                                Nenhuma notificação
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t">
                        <button className="w-full text-center text-sm text-gray-600 hover:text-gray-900">
                            Ver todas as notificações
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
