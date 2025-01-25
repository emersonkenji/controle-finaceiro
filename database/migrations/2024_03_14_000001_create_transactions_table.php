<?php

namespace Database\Migrations;

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Schema::create('transactions', function (Blueprint $table) {
        //     $table->id();
        //     $table->decimal('amount', 10, 2);
        //     $table->timestamps();
        // });

        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['receivable', 'payable']);
            $table->string('description');
            $table->decimal('amount', 10, 2);
            $table->date('paid_date')->nullable();
            $table->date('due_date');
            $table->datetime('payment_date')->nullable();
            $table->enum('status', ['pending', 'paid', 'cancelled'])->default('pending');
            $table->string('payment_method')->nullable();
            $table->foreignId('category_id')->constrained('transaction_categories')->restrictOnDelete();
            $table->integer('installment_number')->nullable();
            $table->integer('total_installments')->nullable();
            $table->foreignId('cost_center_id')->nullable()->constrained('cost_centers')->restrictOnDelete();
            // $table->foreignId('bank_reconciliation_id')->nullable()->constrained('bank_statements')->nullOnDelete();
            $table->morphs('reference');
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->text('notes')->nullable();
            $table->string('document_number')->nullable();
            // $table->timestamp('reconciled_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('transactions');
    }
};
