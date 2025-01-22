<?php
namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class FinancialDashboardController extends Controller
{
    public function index()
    {
        // Total de contas a pagar e receber
        $totals = [
            'receivables' => [
                'total' => Transaction::receivables()->sum('amount'),
                'pending' => Transaction::receivables()->pending()->sum('amount'),
                'overdue' => Transaction::receivables()->overdue()->sum('amount'),
                'paid' => Transaction::receivables()->paid()->sum('amount'),
            ],
            'payables' => [
                'total' => Transaction::payables()->sum('amount'),
                'pending' => Transaction::payables()->pending()->sum('amount'),
                'overdue' => Transaction::payables()->overdue()->sum('amount'),
                'paid' => Transaction::payables()->paid()->sum('amount'),
            ],
        ];

        // Contas a vencer nos próximos 30 dias
        $nextDueTransactions = Transaction::where('due_date', '>=', now())
            ->where('due_date', '<=', now()->addDays(30))
            ->whereNull('paid_date')
            ->orderBy('due_date')
            ->with(['category', 'costCenter'])
            ->get()
            ->groupBy('type');

        // Fluxo de caixa dos últimos 12 meses
        $cashFlow = DB::table('transactions')
            ->select(
                DB::raw('DATE_FORMAT(due_date, "%Y-%m") as month'),
                DB::raw('SUM(CASE WHEN type = "receivable" THEN amount ELSE 0 END) as receivables'),
                DB::raw('SUM(CASE WHEN type = "payable" THEN amount ELSE 0 END) as payables')
            )
            ->where('due_date', '>=', now()->subMonths(12))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return Inertia::render('Financial/Dashboard', [
            'totals' => $totals,
            'nextDueTransactions' => $nextDueTransactions,
            'cashFlow' => $cashFlow,
        ]);
    }
}
