<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('carriers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('document', 20);
            $table->string('contact_name');
            $table->string('contact_phone', 20);
            $table->string('contact_email');
            $table->string('address');
            $table->string('city', 100);
            $table->string('state', 2);
            $table->string('zip_code', 10);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('carriers');
    }
};
