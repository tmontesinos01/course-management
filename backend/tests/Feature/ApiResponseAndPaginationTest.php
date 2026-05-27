<?php

use App\Models\Curso;
use App\Models\Estudiante;
use App\Models\Inscripcion;
use App\Models\MedioPago;
use App\Enums\EstadoCurso;

test('API responses have standardized format with success', function () {
    Curso::factory()->create(['nombre' => 'Curso Test']);

    $response = $this->getJson('/api/v1/cursos');

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'status',
        'message',
        'data',
    ]);
    expect($response->json('status'))->toBe(200);
    expect($response->json('message'))->toBe('OK');
});

test('API responses have standardized format on create', function () {
    $data = [
        'nombre' => 'Nuevo Curso',
        'cupos' => 20,
        'importe' => 150.00,
        'fecha_desde' => '2026-06-01',
        'fecha_hasta' => '2026-06-30',
        'estado' => EstadoCurso::Activo->value,
        'tipo_curso' => 'Varios',
    ];

    $response = $this->postJson('/api/v1/cursos', $data);

    $response->assertStatus(201);
    $response->assertJsonStructure([
        'status',
        'message',
        'data' => ['id', 'nombre', 'cupos', 'estado'],
    ]);
    expect($response->json('status'))->toBe(201);
    expect($response->json('message'))->toBe('Recurso creado exitosamente');
});

test('API responses have standardized format on update', function () {
    $curso = Curso::factory()->create();

    $response = $this->putJson("/api/v1/cursos/{$curso->id}", [
        'nombre' => 'Curso Actualizado',
        'cupos' => 25,
        'importe' => 200.00,
        'fecha_desde' => '2026-06-01',
        'fecha_hasta' => '2026-06-30',
        'estado' => EstadoCurso::Activo->value,
        'tipo_curso' => 'Varios',
    ]);

    $response->assertStatus(200);
    expect($response->json('message'))->toBe('Curso actualizado exitosamente');
});

test('API responses have standardized format on delete', function () {
    $curso = Curso::factory()->create();

    $response = $this->deleteJson("/api/v1/cursos/{$curso->id}");

    $response->assertStatus(200);
    expect($response->json('message'))->toBe('Curso eliminado exitosamente');
});

test('API pagination works with default per_page', function () {
    Curso::factory()->count(20)->create();

    $response = $this->getJson('/api/v1/cursos');

    $response->assertStatus(200);
    expect($response->json('data'))->toHaveCount(15);
    expect($response->json('meta.current_page'))->toBe(1);
    expect($response->json('meta.total'))->toBe(20);
});

test('API pagination works with custom per_page', function () {
    Curso::factory()->count(20)->create();

    $response = $this->getJson('/api/v1/cursos?per_page=5');

    $response->assertStatus(200);
    expect($response->json('data'))->toHaveCount(5);
});

test('API pagination works with page parameter', function () {
    Curso::factory()->count(20)->create();

    $response = $this->getJson('/api/v1/cursos?page=2&per_page=5');

    $response->assertStatus(200);
    expect($response->json('data'))->toHaveCount(5);
    expect($response->json('meta.current_page'))->toBe(2);
});

test('Estudiante endpoint uses pagination', function () {
    Estudiante::factory()->count(20)->create();

    $response = $this->getJson('/api/v1/estudiantes?per_page=10');

    $response->assertStatus(200);
    expect($response->json('data'))->toHaveCount(10);
});

test('MedioPago endpoint uses pagination', function () {
    MedioPago::factory()->count(20)->create();

    $response = $this->getJson('/api/v1/medios-pagos?per_page=8');

    $response->assertStatus(200);
    expect($response->json('data'))->toHaveCount(8);
});

test('Inscripcion endpoint uses pagination with relationships', function () {
    Inscripcion::factory()->count(15)->create();

    $response = $this->getJson('/api/v1/inscripciones?per_page=10');

    $response->assertStatus(200);
    expect($response->json('data'))->toHaveCount(10);
    $firstItem = $response->json('data')[0];
    expect($firstItem)->toHaveKeys(['curso', 'participante']);
});
