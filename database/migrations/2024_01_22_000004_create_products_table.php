<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('sku')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('cost_price', 10, 2);
            $table->decimal('promotional_price', 10, 2)->nullable();
            $table->foreignId('category_id')->constrained('product_categories');
            $table->integer('stock')->default(0);
            $table->integer('min_stock')->default(5);
            $table->string('status')->default('active');
            $table->decimal('weight', 8, 3)->nullable(); // em kg
            $table->decimal('width', 8, 2)->nullable(); // em cm
            $table->decimal('height', 8, 2)->nullable(); // em cm
            $table->decimal('length', 8, 2)->nullable(); // em cm
            $table->string('barcode')->nullable();
            $table->boolean('featured')->default(false);
            $table->json('attributes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
};
