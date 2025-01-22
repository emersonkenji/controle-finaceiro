import { useState } from 'react';
import {
    MessageSquare,
    Send,
    Trash2,
    Edit2,
    X,
    Check
} from 'lucide-react';

export default function ReportComments({ reportId }) {
    const [comments, setComments] = useState([
        {
            id: 1,
            user: {
                name: 'João Silva',
                avatar: 'https://ui-avatars.com/api/?name=João+Silva&background=0D8ABC&color=fff'
            },
            content: 'Notei um aumento significativo nas despesas operacionais.',
            createdAt: new Date(Date.now() - 3600000), // 1 hora atrás
            edited: false
        },
        {
            id: 2,
            user: {
                name: 'Maria Santos',
                avatar: 'https://ui-avatars.com/api/?name=Maria+Santos&background=ABC123&color=fff'
            },
            content: 'Precisamos analisar melhor a margem de lucro dos produtos.',
            createdAt: new Date(Date.now() - 7200000), // 2 horas atrás
            edited: true
        }
    ]);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [editContent, setEditContent] = useState('');

    const formatDate = (date) => {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 60) {
            return `${minutes} minutos atrás`;
        } else if (hours < 24) {
            return `${hours} horas atrás`;
        } else {
            return `${days} dias atrás`;
        }
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const comment = {
            id: Date.now(),
            user: {
                name: 'Usuário Atual',
                avatar: 'https://ui-avatars.com/api/?name=Usuário+Atual&background=4F46E5&color=fff'
            },
            content: newComment,
            createdAt: new Date(),
            edited: false
        };

        setComments([comment, ...comments]);
        setNewComment('');
    };

    const handleEditComment = (comment) => {
        setEditingComment(comment.id);
        setEditContent(comment.content);
    };

    const handleSaveEdit = (commentId) => {
        setComments(comments.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    content: editContent,
                    edited: true
                };
            }
            return comment;
        }));
        setEditingComment(null);
        setEditContent('');
    };

    const handleDeleteComment = (commentId) => {
        setComments(comments.filter(comment => comment.id !== commentId));
    };

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Cabeçalho */}
            <div className="px-6 py-4 border-b">
                <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-gray-500" />
                    <h3 className="text-lg font-medium text-gray-900">Comentários</h3>
                </div>
            </div>

            {/* Lista de Comentários */}
            <div className="px-6 py-4 space-y-6">
                {/* Novo Comentário */}
                <div className="flex gap-3">
                    <img
                        src="https://ui-avatars.com/api/?name=Usuário+Atual&background=4F46E5&color=fff"
                        alt="Avatar"
                        className="h-8 w-8 rounded-full"
                    />
                    <div className="flex-1">
                        <div className="relative">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Adicione um comentário..."
                                rows="2"
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-none"
                            />
                            <button
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                                className="absolute bottom-2 right-2 p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Comentários Existentes */}
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                            <img
                                src={comment.user.avatar}
                                alt={comment.user.name}
                                className="h-8 w-8 rounded-full"
                            />
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="font-medium text-gray-900">
                                            {comment.user.name}
                                        </span>
                                        <span className="ml-2 text-sm text-gray-500">
                                            {formatDate(comment.createdAt)}
                                            {comment.edited && (
                                                <span className="ml-1 text-xs text-gray-400">
                                                    (editado)
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEditComment(comment)}
                                            className="p-1 text-gray-400 hover:text-gray-600"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="p-1 text-gray-400 hover:text-gray-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                {editingComment === comment.id ? (
                                    <div className="mt-2">
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            rows="2"
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-none"
                                        />
                                        <div className="mt-2 flex justify-end gap-2">
                                            <button
                                                onClick={() => setEditingComment(null)}
                                                className="p-1 text-gray-400 hover:text-gray-600"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleSaveEdit(comment.id)}
                                                className="p-1 text-green-500 hover:text-green-600"
                                            >
                                                <Check className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="mt-1 text-gray-600">
                                        {comment.content}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
