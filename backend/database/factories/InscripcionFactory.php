<?php

namespace Database\Factories;

use App\Models\Curso;
use App\Models\Estudiante;
use App\Models\Inscripcion;
use Illuminate\Database\Eloquent\Factories\Factory;

class InscripcionFactory extends Factory
{
    protected $model = Inscripcion::class;

    public function definition(): array
    {
        return [
            'id_curso' => Curso::factory(),
            'id_participante' => Estudiante::factory(),
            'fecha_alta' => now(),
            'fecha_log' => now(),
        ];
    }
}
