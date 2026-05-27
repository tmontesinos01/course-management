<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('cursos', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('estudiantes', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('inscripciones', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('medios_pagos', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cursos', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('estudiantes', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('inscripciones', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('medios_pagos', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
