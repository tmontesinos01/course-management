<?php

namespace Database\Factories;

use App\Enums\EstadoCurso;
use App\Models\Curso;
use Illuminate\Database\Eloquent\Factories\Factory;

class CursoFactory extends Factory
{
    protected $model = Curso::class;

    public function definition(): array
    {
        return [
            'nombre' => fake()->words(3, true),
            'cupos' => fake()->numberBetween(5, 50),
            'importe' => fake()->randomFloat(2, 100, 5000),
            'fecha_desde' => fake()->date(),
            'fecha_hasta' => fake()->date(),
            'estado' => fake()->randomElement(EstadoCurso::cases())->value,
            'tipo_curso' => fake()->randomElement(['Varios', 'Charla', 'Formacion profesional']),
            'fecha_alta' => now(),
            'fecha_log' => now(),
        ];
    }
}
