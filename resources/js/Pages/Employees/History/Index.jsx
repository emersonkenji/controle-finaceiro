import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Download, FileText, Trash } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/Components/ui/alert-dialog';

export default function Index({ employee, history }) {
    const [historyToDelete, setHistoryToDelete] = useState(null);

    const handleDelete = () => {
        if (!historyToDelete) return;

        router.delete(route('employees.history.destroy', [employee.id, historyToDelete.id]), {
            onSuccess: () => setHistoryToDelete(null)
        });
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Histórico - ${employee.name}`} />

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center mb-6">
                    <Link href={route('employees.index')}>
                        <Button variant="ghost" className="mr-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-semibold">Histórico - {employee.name}</h1>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Usuário</TableHead>
                                <TableHead>Anexos</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.data.map(record => (
                                <TableRow key={record.id}>
                                    <TableCell>{formatDate(record.date)}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded text-sm ${
                                            record.type === 'update'
                                                ? 'bg-blue-100 text-blue-800'
                                                : record.type === 'document'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {record.type === 'update' ? 'Atualização'
                                                : record.type === 'document' ? 'Documento'
                                                : 'Outro'}
                                        </span>
                                    </TableCell>
                                    <TableCell>{record.description}</TableCell>
                                    <TableCell>{record.user?.name || 'Sistema'}</TableCell>
                                    <TableCell>
                                        {record.attachments.length > 0 && (
                                            <div className="space-y-1">
                                                {record.attachments.map(attachment => (
                                                    <div key={attachment.id} className="flex items-center text-sm">
                                                        <FileText className="w-4 h-4 mr-2" />
                                                        <span className="flex-1">{attachment.name}</span>
                                                        <span className="text-gray-500 ml-2">
                                                            ({formatFileSize(attachment.size)})
                                                        </span>
                                                        <Link
                                                            href={route('attachments.download', attachment.id)}
                                                            className="ml-2 text-blue-600 hover:text-blue-800"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Abrir menu</span>
                                                    <svg
                                                        className="h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                    </svg>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setHistoryToDelete(record)}>
                                                    <Trash className="w-4 h-4 mr-2" />
                                                    Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <AlertDialog open={!!historyToDelete} onOpenChange={() => setHistoryToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente este registro do histórico
                            e todos os arquivos anexados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AuthenticatedLayout>
    );
}
