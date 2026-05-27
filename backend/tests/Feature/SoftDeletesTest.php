<?php

use App\Models\Curso;
use App\Models\Estudiante;
use App\Models\Inscripcion;
use App\Models\MedioPago;

test('Curso uses soft deletes', function () {
    $curso = Curso::factory()->create();
    $id = $curso->id;

    $curso->delete();

    $deletedCurso = Curso::withTrashed()->find($id);
    expect($deletedCurso)->not->toBeNull();
    expect($deletedCurso->trashed())->toBeTrue();

    $activeCurso = Curso::find($id);
    expect($activeCurso)->toBeNull();

    $curso->restore();
    $restoredCurso = Curso::find($id);
    expect($restoredCurso)->not->toBeNull();
});

test('Estudiante uses soft deletes', function () {
    $estudiante = Estudiante::factory()->create();
    $id = $estudiante->id;

    $estudiante->delete();

    expect(Estudiante::find($id))->toBeNull();
    expect(Estudiante::withTrashed()->find($id))->not->toBeNull();
});

test('Inscripcion uses soft deletes', function () {
    $inscripcion = Inscripcion::factory()->create();
    $id = $inscripcion->id;

    $inscripcion->delete();

    expect(Inscripcion::find($id))->toBeNull();
    expect(Inscripcion::withTrashed()->find($id))->not->toBeNull();
});

test('MedioPago uses soft deletes', function () {
    $medioPago = MedioPago::factory()->create();
    $id = $medioPago->id;

    $medioPago->delete();

    expect(MedioPago::find($id))->toBeNull();
    expect(MedioPago::withTrashed()->find($id))->not->toBeNull();
});
