<?php

use App\Models\Curso;
use App\Models\Estudiante;
use App\Models\Inscripcion;

test('Complete flow: create course, student, enroll and verify available slots', function () {
    // 1. Create course with 5 slots
    $curso = Curso::factory()->create([
        'nombre' => 'Curso de PHP Avanzado',
        'cupos' => 5,
        'importe' => 200.00,
        'estado' => \App\Enums\EstadoCurso::Activo->value,
    ]);

    // Verify course exists
    expect($curso->id)->toBeGreaterThan(0);
    expect($curso->cupos)->toBe(5);

    // 2. Create student
    $estudiante = Estudiante::factory()->create([
        'apellido_y_nombre' => 'Juan Pérez',
        'dni' => '12345678',
    ]);

    expect($estudiante->id)->toBeGreaterThan(0);

    // 3. Enroll student
    $response = $this->postJson('/api/v1/inscripciones', [
        'id_curso' => $curso->id,
        'id_participante' => $estudiante->id,
    ]);

    $response->assertStatus(201);
    expect($response->json('data.id_curso'))->toBe($curso->id);
    expect($response->json('data.id_participante'))->toBe($estudiante->id);

    // 4. Verify enrollment exists
    $inscripcion = Inscripcion::find($response->json('data.id'));
    expect($inscripcion)->not->toBeNull();
    expect($inscripcion->curso->id)->toBe($curso->id);
    expect($inscripcion->participante->id)->toBe($estudiante->id);

    // 5. Verify course shows in enrollment API with relationships
    $response = $this->getJson("/api/v1/inscripciones/{$inscripcion->id}");
    $response->assertStatus(200);
    expect($response->json('data.curso.nombre'))->toBe('Curso de PHP Avanzado');
    expect($response->json('data.participante.apellido_y_nombre'))->toBe('Juan Pérez');
});

test('Complete flow: fill all slots and reject additional enrollments', function () {
    // Create course with 2 slots
    $curso = Curso::factory()->create(['cupos' => 2]);

    // Create 2 students and enroll them
    $estudiante1 = Estudiante::factory()->create();
    $estudiante2 = Estudiante::factory()->create();
    $estudiante3 = Estudiante::factory()->create();

    $this->postJson('/api/v1/inscripciones', [
        'id_curso' => $curso->id,
        'id_participante' => $estudiante1->id,
    ])->assertStatus(201);

    $this->postJson('/api/v1/inscripciones', [
        'id_curso' => $curso->id,
        'id_participante' => $estudiante2->id,
    ])->assertStatus(201);

    // Third enrollment should fail
    $response = $this->postJson('/api/v1/inscripciones', [
        'id_curso' => $curso->id,
        'id_participante' => $estudiante3->id,
    ]);

    $response->assertStatus(422);
    expect($response->json('errors.id_curso'))->not->toBeNull();
});

test('Complete flow: update course and verify changes', function () {
    $curso = Curso::factory()->create(['nombre' => 'Original Name']);

    $response = $this->putJson("/api/v1/cursos/{$curso->id}", [
        'nombre' => 'Updated Name',
        'cupos' => 10,
        'importe' => 150.00,
        'fecha_desde' => '2026-07-01',
        'fecha_hasta' => '2026-07-31',
        'estado' => \App\Enums\EstadoCurso::Activo->value,
        'tipo_curso' => 'Formacion profesional',
    ]);

    $response->assertStatus(200);
    expect($response->json('data.nombre'))->toBe('Updated Name');

    // Verify in database
    $curso->refresh();
    expect($curso->nombre)->toBe('Updated Name');
    expect($curso->cupos)->toBe(10);
});

test('Complete flow: soft delete and restore course', function () {
    $curso = Curso::factory()->create();
    $id = $curso->id;

    // Delete
    $this->deleteJson("/api/v1/cursos/{$id}")
        ->assertStatus(200);

    // Verify soft deleted (not in index)
    $response = $this->getJson('/api/v1/cursos');
    $ids = collect($response->json('data'))->pluck('id')->toArray();
    expect(in_array($id, $ids))->toBeFalse();

    // Restore via model directly
    Curso::withTrashed()->find($id)->restore();

    // Verify restored
    $response = $this->getJson('/api/v1/cursos');
    $ids = collect($response->json('data'))->pluck('id')->toArray();
    expect(in_array($id, $ids))->toBeTrue();
});

test('Complete flow: unique DNI prevents duplicate students', function () {
    // Create first student
    $this->postJson('/api/v1/estudiantes', [
        'apellido_y_nombre' => 'Student One',
        'dni' => '99988877',
    ])->assertStatus(201);

    // Try to create second student with same DNI
    $response = $this->postJson('/api/v1/estudiantes', [
        'apellido_y_nombre' => 'Student Two',
        'dni' => '99988877',
    ]);

    $response->assertStatus(422);
    expect($response->json('errors.dni'))->not->toBeNull();
});
