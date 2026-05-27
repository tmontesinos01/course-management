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
        Schema::create('estudiantes', function (Blueprint $table) {
            $table->id();
            $table->string('apellido_y_nombre');
            $table->string('matricula')->nullable();
            $table->string('dni');
            $table->string('correo')->nullable();
            $table->string('telefono')->nullable();
            $table->text('observacion')->nullable();
            $table->timestamp('fecha_log')->nullable();
            $table->timestamp('fecha_alta')->nullable();
            $table->foreignId('user_log')->nullable()->constrained('users');
            $table->boolean('agremiado')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estudiantes');
    }
};
