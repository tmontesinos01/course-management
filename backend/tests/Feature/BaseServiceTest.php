<?php

use App\Models\Curso;
use App\Models\Estudiante;
use App\Models\MedioPago;

test('BaseService create sets fecha_alta automatically', function () {
    $curso = Curso::factory()->create();

    expect($curso->fecha_alta)->not->toBeNull();
    expect($curso->fecha_alta)->toBeInstanceOf(\Carbon\Carbon::class);
});

test('BaseService create sets fecha_log automatically', function () {
    $curso = Curso::factory()->create();

    expect($curso->fecha_log)->not->toBeNull();
    expect($curso->fecha_log)->toBeInstanceOf(\Carbon\Carbon::class);
});

test('BaseService update updates fecha_log automatically via API', function () {
    $curso = Curso::factory()->create();
    $originalFechaLog = $curso->fecha_log->copy();

    sleep(1); // Ensure time difference

    // Use API endpoint to trigger BaseService::update
    $response = $this->putJson("/api/v1/cursos/{$curso->id}", [
        'nombre' => 'Nombre Actualizado',
        'cupos' => $curso->cupos,
        'importe' => $curso->importe,
        'fecha_desde' => $curso->fecha_desde->format('Y-m-d'),
        'fecha_hasta' => $curso->fecha_hasta->format('Y-m-d'),
        'estado' => $curso->estado,
        'tipo_curso' => $curso->tipo_curso,
    ]);

    $response->assertStatus(200);

    $updatedCurso = $curso->fresh();
    expect($updatedCurso->fecha_log->greaterThan($originalFechaLog))->toBeTrue();
});

test('BaseService works for all models - Estudiante', function () {
    $estudiante = Estudiante::factory()->create();

    expect($estudiante->fecha_alta)->not->toBeNull();
    expect($estudiante->fecha_log)->not->toBeNull();
});

test('BaseService works for all models - MedioPago', function () {
    $medioPago = MedioPago::factory()->create();

    expect($medioPago->fecha_alta)->not->toBeNull();
    expect($medioPago->fecha_log)->not->toBeNull();
});

test('fecha_alta remains unchanged on update via API', function () {
    $curso = Curso::factory()->create();
    $originalFechaAlta = $curso->fecha_alta->copy();

    sleep(1);

    // Use API endpoint to trigger BaseService::update
    $response = $this->putJson("/api/v1/cursos/{$curso->id}", [
        'nombre' => 'Otro Nombre',
        'cupos' => $curso->cupos,
        'importe' => $curso->importe,
        'fecha_desde' => $curso->fecha_desde->format('Y-m-d'),
        'fecha_hasta' => $curso->fecha_hasta->format('Y-m-d'),
        'estado' => $curso->estado,
        'tipo_curso' => $curso->tipo_curso,
    ]);

    $response->assertStatus(200);

    expect($curso->fresh()->fecha_alta->equalTo($originalFechaAlta))->toBeTrue();
});
