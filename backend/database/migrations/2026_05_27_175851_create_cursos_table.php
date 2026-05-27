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
        Schema::create('cursos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->integer('cupos');
            $table->decimal('importe', 10, 2);
            $table->date('fecha_desde');
            $table->date('fecha_hasta');
            $table->string('estado');
            $table->enum('tipo_curso', ['Varios', 'Charla', 'Formacion profesional']);
            $table->timestamp('fecha_log')->nullable();
            $table->timestamp('fecha_alta')->nullable();
            $table->foreignId('user_log')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cursos');
    }
};
