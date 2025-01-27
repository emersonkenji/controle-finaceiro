<?php

namespace Database\Migrations;

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('document')->unique();
            $table->date('birth_date')->nullable();
            $table->date('hire_date');
            $table->date('termination_date')->nullable();
            $table->string('position');
            $table->string('department');
            $table->decimal('salary', 10, 2);
            $table->decimal('commission_rate', 5, 2)->default(0);
            $table->boolean('status')->default(true);
            $table->text('notes')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('employee_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->text('description');
            $table->datetime('date');
            $table->json('data')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        // Remover a chave estrangeira na tabela 'employee_histories'
        Schema::table('employee_histories', function (Blueprint $table) {
            $table->dropForeign(['employee_id']);  // Remover a chave estrangeira de 'employee_id'
        });
        Schema::dropIfExists('employees');
        Schema::dropIfExists('employee_histories');
    }
};
