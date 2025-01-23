import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Download, Plus, Trash2 } from 'lucide-react';

export default function Index({ backups }) {
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    function formatDate(date) {
        return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Backup" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">Backup</h2>
                        <p className="text-gray-600">Gerencie os backups do sistema</p>
                    </div>
                    <Button asChild>
                        <a href={route('settings.backup.create')} className="gap-2">
                            <Plus className="w-4 h-4" />
                            Novo Backup
                        </a>
                    </Button>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Arquivo</TableHead>
                                <TableHead>Tamanho</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {backups?.map(backup => (
                                <TableRow key={backup.name}>
                                    <TableCell>{backup.name}</TableCell>
                                    <TableCell>{formatBytes(backup.size)}</TableCell>
                                    <TableCell>{formatDate(backup.last_modified)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                asChild
                                            >
                                                <a
                                                    href={route('settings.backup.download', backup.name)}
                                                    title="Download"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </a>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    if (confirm('Tem certeza que deseja excluir este backup?')) {
                                                        window.location.href = route('settings.backup.destroy', backup.name);
                                                    }
                                                }}
                                                title="Excluir"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {backups?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-4 text-center">
                                        Nenhum backup encontrado
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
