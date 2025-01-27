<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique();
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('user_id');
            $table->enum('status', ['pending', 'processing', 'completed', 'cancelled'])->default('pending');
            $table->decimal('subtotal', 10, 2);
            $table->enum('discount_type', ['percentage', 'fixed'])->nullable();
            $table->decimal('discount_value', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->string('payment_method')->nullable();
            $table->enum('payment_status', ['pending', 'partial', 'paid'])->default('pending');
            $table->json('delivery_address')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('restrict');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('product_variation_id')->nullable();
            $table->integer('quantity');
            $table->decimal('price', 10, 2);
            $table->decimal('total', 10, 2);
            $table->timestamps();

            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict');
            $table->foreign('product_variation_id')->references('id')->on('product_variations')->onDelete('restrict');
        });

        Schema::create('order_payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->string('method');
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->string('transaction_id')->nullable();
            $table->datetime('payment_date');
            $table->unsignedBigInteger('user_id');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');
        });

        Schema::create('order_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->text('description');
            $table->json('data')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        // Verifique se a tabela 'order_items' existe antes de tentar remover a chave estrangeira
        if (Schema::hasTable('order_items')) {
            Schema::table('order_items', function (Blueprint $table) {
                $table->dropForeign(['order_id']);  // Remove a chave estrangeira da tabela 'order_items'
            });
        }

        // Verifique se a tabela 'order_payments' existe antes de tentar remover a chave estrangeira
        if (Schema::hasTable('order_payments')) {
            Schema::table('order_payments', function (Blueprint $table) {
                $table->dropForeign(['order_id']);  // Remove a chave estrangeira da tabela 'order_payments'
            });
        }

        // Verifique se a tabela 'order_histories' existe antes de tentar remover a chave estrangeira
        if (Schema::hasTable('order_histories')) {
            Schema::table('order_histories', function (Blueprint $table) {
                $table->dropForeign(['order_id']);  // Remove a chave estrangeira da tabela 'order_histories'
            });
        }

        // Remover as tabelas na ordem correta
        Schema::dropIfExists('order_payments'); // Remove 'order_payments' primeiro
        Schema::dropIfExists('order_items'); // Remove 'order_items' depois
        Schema::dropIfExists('order_histories'); // Remove 'order_histories' depois
        Schema::dropIfExists('orders'); // Por último, remove 'orders'
    }
};
