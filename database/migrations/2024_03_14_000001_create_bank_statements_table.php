<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('bank_statements', function (Blueprint $table) {
            $table->id();
            $table->dateTime('date');
            $table->string('description');
            $table->decimal('amount', 10, 2);
            $table->string('type'); // credit ou debit
            $table->string('bank');
            $table->string('account');
            $table->string('document')->nullable();
            $table->boolean('reconciled')->default(false);
            // $table->foreignId('transaction_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('bank_statements');
    }
};
