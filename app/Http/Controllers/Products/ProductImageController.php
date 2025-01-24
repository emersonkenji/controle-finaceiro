<?php

namespace App\Http\Controllers\Products;

use App\Models\Image;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
{
    public function destroy(Image $image)
    {
        // Verificar se a imagem pertence a um produto
        if ($image->imageable_type !== 'App\\Models\\Product') {
            abort(404);
        }

        // Excluir o arquivo físico
        if (Storage::disk('public')->exists($image->path)) {
            Storage::disk('public')->delete($image->path);
        }

        // Excluir o registro
        $image->delete();

        return response()->json(['message' => 'Imagem excluída com sucesso']);
    }

    public function setMain(Image $image)
    {
        // Verificar se a imagem pertence a um produto
        if ($image->imageable_type !== 'App\\Models\\Product') {
            abort(404);
        }

        // Remover flag de principal de todas as imagens do produto
        $image->imageable->images()->update(['is_main' => false]);

        // Definir esta imagem como principal
        $image->update(['is_main' => true]);

        return response()->json(['message' => 'Imagem definida como principal']);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'data' => 'required|array',
            'data.*.id' => 'required|exists:images,id',
            'data.*.order' => 'required|integer|min:0'
        ]);

        foreach ($request->data as $item) {
            Image::where('id', $item['id'])
                ->where('imageable_type', 'App\\Models\\Product')
                ->update(['order' => $item['order']]);
        }

        return response()->json(['message' => 'Ordem das imagens atualizada com sucesso']);
    }
}
