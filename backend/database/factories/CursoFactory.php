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
        $fechaDesde = fake()->dateTimeBetween('-1 year', '+1 year');
        $fechaHasta = fake()->dateTimeBetween($fechaDesde, '+2 years');

        return [
            'nombre' => fake()->words(3, true),
            'cupos' => fake()->numberBetween(5, 50),
            'importe' => fake()->randomFloat(2, 100, 5000),
            'fecha_desde' => $fechaDesde->format('Y-m-d'),
            'fecha_hasta' => $fechaHasta->format('Y-m-d'),
            'estado' => fake()->randomElement(EstadoCurso::cases())->value,
            'tipo_curso' => fake()->randomElement(['Varios', 'Charla', 'Formacion profesional']),
            'fecha_alta' => now(),
            'fecha_log' => now(),
        ];
    }
}
