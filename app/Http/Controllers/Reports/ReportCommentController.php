<?php

namespace App\Http\Controllers\Reports;

use App\Models\Report;
use Illuminate\Http\Request;
use App\Models\ReportComment;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class ReportCommentController extends Controller
{
    public function store(Request $request, Report $report)
    {
        $validated = $request->validate([
            'content' => 'required|string'
        ]);

        $comment = $report->comments()->create([
            ...$validated,
            'user_id' => Auth::id()
        ]);

        return back()->with('success', 'Comentário adicionado com sucesso.');
    }

    public function update(Request $request, Report $report, ReportComment $comment)
    {
        if ($comment->report_id !== $report->id) {
            abort(404);
        }

        if ($comment->user_id !== Auth::id()) {
            return back()->with('error', 'Você não tem permissão para editar este comentário.');
        }

        $validated = $request->validate([
            'content' => 'required|string'
        ]);

        $comment->update([
            ...$validated,
            'edited' => true
        ]);

        return back()->with('success', 'Comentário atualizado com sucesso.');
    }

    public function destroy(Report $report, ReportComment $comment)
    {
        if ($comment->report_id !== $report->id) {
            abort(404);
        }

        if ($comment->user_id !== Auth::id()) {
            return back()->with('error', 'Você não tem permissão para excluir este comentário.');
        }

        $comment->delete();

        return back()->with('success', 'Comentário excluído com sucesso.');
    }
}
