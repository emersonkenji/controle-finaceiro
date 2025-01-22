<?php
namespace App\Http\Controllers;

use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class AttachmentController extends Controller
{
    public function download(Attachment $attachment)
    {
        if (!Storage::exists($attachment->path)) {
            return back()->with('error', 'Arquivo não encontrado.');
        }

        return Storage::download(
            $attachment->path,
            $attachment->name,
            ['Content-Type' => $attachment->mime_type]
        );
    }

    public function destroy(Attachment $attachment)
    {
        if (Storage::exists($attachment->path)) {
            Storage::delete($attachment->path);
        }

        $attachment->delete();

        return back()->with('success', 'Anexo excluído com sucesso.');
    }
}
