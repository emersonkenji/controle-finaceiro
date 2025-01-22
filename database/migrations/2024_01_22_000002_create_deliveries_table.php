<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('carrier_id')->constrained()->onDelete('restrict');
            $table->string('tracking_code');
            $table->enum('status', ['pending', 'in_transit', 'delivered', 'cancelled'])->default('pending');
            $table->datetime('estimated_delivery');
            $table->datetime('delivered_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('deliveries');
    }
};
