<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Tabela de endereços do cliente
        Schema::create('customer_address', function (Blueprint $table) {
            $table->id();
            $table->string('street');
            $table->string('number');
            $table->text('complement')->nullable();
            $table->string('neighborhood');
            $table->string('city');
            $table->string('state');
            $table->string('zip_code');
            $table->string('country')->default('Brasil'); // Corrigido o nome do campo
            $table->timestamps();
            $table->softDeletes(); // Já inclui o campo `deleted_at`
        });

        // Tabela de clientes
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('document_number')->nullable();
            $table->string('document_type')->nullable();
            $table->unsignedBigInteger('address_id')->nullable(); // Chave estrangeira para endereço
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->decimal('credit_limit', 10, 2)->default(0);
            $table->text('notes')->nullable();
            $table->text('category')->nullable();
            $table->integer('score')->default(0);
            $table->decimal('total_purchases', 10, 2)->default(0);
            $table->timestamp('last_purchase_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Chave estrangeira para endereço
            $table->foreign('address_id')->references('id')->on('customer_address')->onDelete('set null');
        });

        // Tabela de documentos dos clientes
        Schema::create('customer_documents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id');
            $table->string('name');
            $table->string('file_path');
            $table->string('file_type');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            // Chaves estrangeiras
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');
        });

        // Tabela de histórico dos clientes
        Schema::create('customer_history', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id');
            $table->string('type');
            $table->text('description');
            $table->decimal('value', 10, 2)->nullable();
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            // Chaves estrangeiras
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');
        });
    }

    public function down()
    {
        // Remover tabelas na ordem inversa
        Schema::dropIfExists('customer_history');
        Schema::dropIfExists('customer_documents');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('customer_address');
    }
};
