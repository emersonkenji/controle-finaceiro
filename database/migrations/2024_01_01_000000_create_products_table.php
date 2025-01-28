<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('product_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->foreignId('parent_id')->nullable()->constrained('product_categories')->onDelete('set null');
            $table->integer('order')->default(0);
            $table->string('slug')->unique();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('sku')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('cost_price', 10, 2)->default(0);
            $table->integer('stock')->default(0);
            $table->integer('min_stock')->default(0);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->unsignedBigInteger('category_id')->nullable();
            $table->json('attributes')->nullable();
            $table->string('barcode')->nullable()->unique();
            $table->string('slug')->unique();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('category_id')->references('id')->on('product_categories')->onDelete('set null');
        });

        Schema::create('product_variations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->string('name');
            $table->string('sku')->unique();
            $table->decimal('price', 10, 2);
            $table->decimal('cost_price', 10, 2)->default(0);
            $table->integer('stock')->default(0);
            $table->integer('min_stock')->default(0);
            $table->json('attributes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });

        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->string('path');
            $table->boolean('is_main')->default(false);
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });

        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('product_variation_id')->nullable();
            $table->enum('type', ['entrada', 'saida']);
            $table->integer('quantity');
            $table->decimal('unit_cost', 10, 2)->nullable();
            $table->string('reference_type')->nullable();  // Adicione nullable aqui
            $table->unsignedBigInteger('reference_id')->nullable();  // Adicione nullable aqui
            $table->text('description')->nullable();  // Adicione esta linha
            $table->unsignedBigInteger('user_id');  // Adicione esta linha
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict');
            $table->foreign('product_variation_id')->references('id')->on('product_variations')->onDelete('restrict');
            $table->foreign('user_id')->references('id')->on('users');  // Adicione esta linha
        });

        Schema::create('product_price_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained();
            $table->foreignId('product_variation_id')->nullable()->constrained();
            $table->decimal('old_price', 10, 2);
            $table->decimal('new_price', 10, 2);
            $table->string('type'); // regular, cost, promotional
            $table->text('reason')->nullable();
            $table->foreignId('user_id')->constrained();
            $table->timestamps();
        });
    }

    public function down()
    {
        // Verifique se as tabelas existem antes de tentar remover as chaves estrangeiras
        if (Schema::hasTable('stock_movements')) {
            Schema::table('stock_movements', function (Blueprint $table) {
                $table->dropForeign(['product_id']);
                $table->dropForeign(['product_variation_id']);
            });
        }

        if (Schema::hasTable('product_images')) {
            Schema::table('product_images', function (Blueprint $table) {
                $table->dropForeign(['product_id']);
            });
        }

        if (Schema::hasTable('product_variations')) {
            Schema::table('product_variations', function (Blueprint $table) {
                $table->dropForeign(['product_id']);
            });
        }

        if (Schema::hasTable('products')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropForeign(['category_id']);
            });
        }

        // Agora podemos excluir as tabelas sem erros de chave estrangeira
        Schema::dropIfExists('product_price_histories');
        Schema::dropIfExists('stock_movements');
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('product_variations');
        Schema::dropIfExists('products');
        Schema::dropIfExists('product_categories');
    }

};
