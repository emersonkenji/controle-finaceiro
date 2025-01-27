<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('report_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('type');
            $table->json('config')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });

        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained('report_templates')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users');
            $table->string('name');
            $table->string('period');
            $table->json('filters')->nullable();
            $table->json('data')->nullable();
            $table->string('status')->default('pending');
            $table->timestamps();
        });
        Schema::create('report_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_id')->constrained('reports')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users');
            $table->text('content');
            $table->boolean('edited')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::table('report_comments', function (Blueprint $table) {
            $table->dropForeign(['report_id']);  // Remove a chave estrangeira se existir
        });
        Schema::dropIfExists('reports');
        Schema::dropIfExists('report_comments');
        Schema::dropIfExists('report_templates');
    }
};
