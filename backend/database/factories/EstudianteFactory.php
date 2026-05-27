<?php

namespace Database\Factories;

use App\Models\Estudiante;
use Illuminate\Database\Eloquent\Factories\Factory;

class EstudianteFactory extends Factory
{
    protected $model = Estudiante::class;

    public function definition(): array
    {
        return [
            'apellido_y_nombre' => fake()->name(),
            'matricula' => fake()->optional()->numerify('MAT-#####'),
            'dni' => (string) fake()->unique()->numberBetween(10000000, 99999999),
            'correo' => fake()->optional()->email(),
            'telefono' => fake()->optional()->phoneNumber(),
            'observacion' => fake()->optional()->text(),
            'agremiado' => fake()->boolean(),
            'fecha_alta' => now(),
            'fecha_log' => now(),
        ];
    }
}
