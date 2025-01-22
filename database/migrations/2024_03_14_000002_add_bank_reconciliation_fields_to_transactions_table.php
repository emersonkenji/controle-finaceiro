<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId('bank_reconciliation_id')->nullable()->constrained('bank_statements')->onDelete('set null');
            $table->dateTime('reconciled_at')->nullable();
        });
    }

    public function down()
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['bank_reconciliation_id']);
            $table->dropColumn(['bank_reconciliation_id', 'reconciled_at']);
        });
    }
};
