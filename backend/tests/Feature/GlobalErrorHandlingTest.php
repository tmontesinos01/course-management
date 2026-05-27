<?php

use App\Models\Curso;

test('Global error handling returns 404 for non-existent resource', function () {
    $curso = Curso::factory()->create();
    $nonExistentId = $curso->id + 999;
    $response = $this->getJson("/api/v1/cursos/{$nonExistentId}");

    $response->assertStatus(404);
    $response->assertJsonStructure([
        'status',
        'message',
        'errors',
    ]);
    expect($response->json('status'))->toBe(404);
    expect($response->json('message'))->toBe('Recurso no encontrado');
});

test('Global error handling returns 404 for non-existent route', function () {
    $response = $this->getJson('/api/v1/ruta-inexistente');

    $response->assertStatus(404);
    $response->assertJsonStructure([
        'status',
        'message',
        'errors',
    ]);
    expect($response->json('status'))->toBe(404);
    expect($response->json('message'))->toBe('Ruta no encontrada');
});

test('Global error handling returns 422 for validation errors', function () {
    $response = $this->postJson('/api/v1/cursos', [
        'nombre' => '', // Invalid
    ]);

    $response->assertStatus(422);
    $response->assertJsonStructure([
        'status',
        'message',
        'errors',
    ]);
    expect($response->json('status'))->toBe(422);
    expect($response->json('message'))->toBe('Error de validación');
    expect($response->json('errors'))->not->toBeNull();
});

test('Validation errors include specific field errors', function () {
    $response = $this->postJson('/api/v1/cursos', [
        'nombre' => '',
        'cupos' => 'invalid',
    ]);

    $response->assertStatus(422);
    expect($response->json('errors'))->toHaveKeys(['nombre', 'cupos']);
});

test('Update with invalid data returns 422', function () {
    $curso = Curso::factory()->create();

    $response = $this->putJson("/api/v1/cursos/{$curso->id}", [
        'nombre' => 'Test',
        'cupos' => -1, // Invalid
        'importe' => 100,
        'fecha_desde' => '2026-06-01',
        'fecha_hasta' => '2026-06-30',
        'estado' => \App\Enums\EstadoCurso::Activo->value,
        'tipo_curso' => 'Varios',
    ]);

    $response->assertStatus(422);
    expect($response->json('status'))->toBe(422);
});

test('Estudiante unique DNI validation returns 422', function () {
    $existingDni = '12345678';
    \App\Models\Estudiante::factory()->create(['dni' => $existingDni]);

    $response = $this->postJson('/api/v1/estudiantes', [
        'apellido_y_nombre' => 'Nuevo',
        'dni' => $existingDni,
    ]);

    $response->assertStatus(422);
    expect($response->json('errors.dni'))->not->toBeNull();
});

test('Curso enum validation returns 422 for invalid estado', function () {
    $response = $this->postJson('/api/v1/cursos', [
        'nombre' => 'Curso Test',
        'cupos' => 10,
        'importe' => 100,
        'fecha_desde' => '2026-06-01',
        'fecha_hasta' => '2026-06-30',
        'estado' => 'EstadoInvalido',
        'tipo_curso' => 'Varios',
    ]);

    $response->assertStatus(422);
    expect($response->json('errors.estado'))->not->toBeNull();
});

test('Delete non-existent resource returns 404', function () {
    $curso = Curso::factory()->create();
    $nonExistentId = $curso->id + 999;
    $response = $this->deleteJson("/api/v1/cursos/{$nonExistentId}");

    $response->assertStatus(404);
    expect($response->json('status'))->toBe(404);
});
