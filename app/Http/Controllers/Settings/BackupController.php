<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\Process\Process;

class BackupController extends Controller
{
    public function index()
    {
        $backups = collect(Storage::disk('backups')->files())
            ->map(function ($file) {
                return [
                    'name' => $file,
                    'size' => Storage::disk('backups')->size($file),
                    'date' => Storage::disk('backups')->lastModified($file),
                ];
            })
            ->sortByDesc('date')
            ->values();

        return Inertia::render('Settings/Backup/Index', [
            'backups' => $backups
        ]);
    }

    public function create()
    {
        try {
            $filename = 'backup-' . now()->format('Y-m-d-H-i-s') . '.sql';
            $path = storage_path("app/backups/{$filename}");

            // Cria o diretório de backups se não existir
            if (!Storage::disk('backups')->exists('')) {
                Storage::disk('backups')->makeDirectory('');
            }

            // Executa o comando mysqldump
            $process = new Process([
                'mysqldump',
                '--user=' . config('database.connections.mysql.username'),
                '--password=' . config('database.connections.mysql.password'),
                config('database.connections.mysql.database'),
                '--result-file=' . $path
            ]);

            $process->run();

            if (!$process->isSuccessful()) {
                throw new \Exception('Erro ao criar backup: ' . $process->getErrorOutput());
            }

            // Compacta o arquivo SQL
            $zip = new \ZipArchive();
            $zipName = str_replace('.sql', '.zip', $path);

            if ($zip->open($zipName, \ZipArchive::CREATE) === true) {
                $zip->addFile($path, $filename);
                $zip->close();

                // Remove o arquivo SQL original
                unlink($path);
            }

            return redirect()->back()->with('success', 'Backup criado com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function download($filename)
    {
        try {
            return Storage::disk('backups')->download($filename);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao baixar o backup.');
        }
    }

    public function destroy($filename)
    {
        try {
            if (Storage::disk('backups')->delete($filename)) {
                return redirect()->back()->with('success', 'Backup excluído com sucesso.');
            }

            return redirect()->back()->with('error', 'Erro ao excluir o backup.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
