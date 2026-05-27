<?php

use App\Models\Curso;
use App\Models\Estudiante;
use App\Models\Inscripcion;
use App\Services\InscripcionService;
use App\Repositories\InscripcionRepository;
use Illuminate\Validation\ValidationException;

test('InscripcionService rejects inscription when course has no available slots', function () {
    $curso = Curso::factory()->create(['cupos' => 2]);
    $estudiante = Estudiante::factory()->create();

    Inscripcion::factory()->count(2)->create([
        'id_curso' => $curso->id,
        'id_participante' => Estudiante::factory(),
    ]);

    $repository = new InscripcionRepository(new Inscripcion());
    $service = new InscripcionService($repository);

    expect(fn() => $service->create([
        'id_curso' => $curso->id,
        'id_participante' => $estudiante->id,
    ]))->toThrow(ValidationException::class);
});

test('InscripcionService allows inscription when course has available slots', function () {
    $curso = Curso::factory()->create(['cupos' => 5]);
    $estudiante = Estudiante::factory()->create();

    Inscripcion::factory()->count(3)->create([
        'id_curso' => $curso->id,
        'id_participante' => Estudiante::factory(),
    ]);

    $repository = new InscripcionRepository(new Inscripcion());
    $service = new InscripcionService($repository);

    $inscripcion = $service->create([
        'id_curso' => $curso->id,
        'id_participante' => $estudiante->id,
    ]);

    expect($inscripcion)->not->toBeNull();
    expect($inscripcion->id_curso)->toBe($curso->id);
});

test('EstudianteRequest requires unique DNI on create', function () {
    $existingDni = '12345678';
    Estudiante::factory()->create(['dni' => $existingDni]);

    $response = $this->postJson('/api/v1/estudiantes', [
        'apellido_y_nombre' => 'Nuevo Estudiante',
        'dni' => $existingDni,
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['dni']);
});

test('EstudianteRequest allows same DNI on update', function () {
    $estudiante = Estudiante::factory()->create(['dni' => '12345678']);

    $response = $this->putJson("/api/v1/estudiantes/{$estudiante->id}", [
        'apellido_y_nombre' => 'Nombre Actualizado',
        'dni' => '12345678',
    ]);

    $response->assertStatus(200);
});

test('EstudianteRequest rejects different DNI on update', function () {
    $estudiante = Estudiante::factory()->create(['dni' => '12345678']);
    Estudiante::factory()->create(['dni' => '87654321']);

    $response = $this->putJson("/api/v1/estudiantes/{$estudiante->id}", [
        'apellido_y_nombre' => 'Nombre Actualizado',
        'dni' => '87654321',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['dni']);
});
