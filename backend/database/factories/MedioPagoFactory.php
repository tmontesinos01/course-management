<?php

namespace Database\Factories;

use App\Models\MedioPago;
use Illuminate\Database\Eloquent\Factories\Factory;

class MedioPagoFactory extends Factory
{
    protected $model = MedioPago::class;

    public function definition(): array
    {
        return [
            'nombre' => fake()->word(),
            'descripcion' => fake()->optional()->sentence(),
            'activo' => fake()->boolean(80),
            'fecha_alta' => now(),
            'fecha_log' => now(),
        ];
    }
}
