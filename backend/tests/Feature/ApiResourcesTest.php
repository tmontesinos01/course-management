<?php

use App\Http\Resources\CursoResource;
use App\Http\Resources\EstudianteResource;
use App\Http\Resources\InscripcionResource;
use App\Http\Resources\MedioPagoResource;
use App\Models\Curso;
use App\Models\Estudiante;
use App\Models\Inscripcion;
use App\Models\MedioPago;
use App\Enums\EstadoCurso;

test('CursoResource transforms model correctly', function () {
    $curso = Curso::factory()->create([
        'nombre' => 'Curso Test',
        'cupos' => 10,
        'importe' => 100.50,
        'estado' => EstadoCurso::Activo->value,
    ]);

    $resource = new CursoResource($curso);
    $data = $resource->toArray(request());

    expect($data)->toHaveKeys([
        'id', 'nombre', 'cupos', 'importe', 'fecha_desde', 'fecha_hasta', 'estado', 'tipo_curso'
    ]);
    expect($data['nombre'])->toBe('Curso Test');
    expect($data['cupos'])->toBe(10);
    expect($data['estado'])->toBe('Activo');
});

test('EstudianteResource transforms model correctly', function () {
    $estudiante = Estudiante::factory()->create([
        'apellido_y_nombre' => 'Juan Perez',
        'dni' => '12345678',
    ]);

    $resource = new EstudianteResource($estudiante);
    $data = $resource->toArray(request());

    expect($data)->toHaveKeys(['id', 'apellido_y_nombre', 'dni', 'agremiado']);
    expect($data['apellido_y_nombre'])->toBe('Juan Perez');
    expect($data['dni'])->toBe('12345678');
});

test('InscripcionResource includes relationships when loaded', function () {
    $curso = Curso::factory()->create();
    $estudiante = Estudiante::factory()->create();
    $inscripcion = Inscripcion::factory()->create([
        'id_curso' => $curso->id,
        'id_participante' => $estudiante->id,
    ]);

    $inscripcion->load(['curso', 'participante']);

    $resource = new InscripcionResource($inscripcion);
    $data = $resource->toArray(request());

    expect($data)->toHaveKeys(['id', 'id_curso', 'id_participante', 'curso', 'participante']);
    expect($data['curso'])->not->toBeNull();
    expect($data['participante'])->not->toBeNull();
});

test('MedioPagoResource transforms model correctly', function () {
    $medioPago = MedioPago::factory()->create([
        'nombre' => 'Efectivo',
        'activo' => true,
    ]);

    $resource = new MedioPagoResource($medioPago);
    $data = $resource->toArray(request());

    expect($data)->toHaveKeys(['id', 'nombre', 'activo']);
    expect($data['nombre'])->toBe('Efectivo');
    expect($data['activo'])->toBe(true);
});
