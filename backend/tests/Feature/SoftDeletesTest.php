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

test('Estudiante can be restored after soft delete', function () {
    $estudiante = Estudiante::factory()->create(['apellido_y_nombre' => 'Restore Test']);
    $id = $estudiante->id;

    $estudiante->delete();
    expect(Estudiante::find($id))->toBeNull();

    Estudiante::withTrashed()->find($id)->restore();

    $restored = Estudiante::find($id);
    expect($restored)->not->toBeNull();
    expect($restored->apellido_y_nombre)->toBe('Restore Test');
    expect($restored->trashed())->toBeFalse();
});

test('Inscripcion can be restored after soft delete', function () {
    $inscripcion = Inscripcion::factory()->create();
    $id = $inscripcion->id;
    $cursoId = $inscripcion->id_curso;

    $inscripcion->delete();
    expect(Inscripcion::find($id))->toBeNull();

    Inscripcion::withTrashed()->find($id)->restore();

    $restored = Inscripcion::find($id);
    expect($restored)->not->toBeNull();
    expect($restored->id_curso)->toBe($cursoId);
});

test('MedioPago can be restored after soft delete', function () {
    $medioPago = MedioPago::factory()->create(['nombre' => 'Efectivo Test']);
    $id = $medioPago->id;

    $medioPago->delete();

    MedioPago::withTrashed()->find($id)->restore();

    $restored = MedioPago::find($id);
    expect($restored)->not->toBeNull();
    expect($restored->nombre)->toBe('Efectivo Test');
});

test('Deleted_at is null after restore', function () {
    $curso = Curso::factory()->create();
    $id = $curso->id;

    $curso->delete();
    expect($curso->fresh()->deleted_at)->not->toBeNull();

    $curso->restore();
    expect($curso->fresh()->deleted_at)->toBeNull();
});

test('Only trashed records returned by withTrashed scope', function () {
    $active = Curso::factory()->create();
    $deleted = Curso::factory()->create();
    $deleted->delete();

    $trashedCount = Curso::onlyTrashed()->count();
    $withTrashedCount = Curso::withTrashed()->count();
    $normalCount = Curso::count();

    expect($normalCount)->toBe(1); // Only active
    expect($trashedCount)->toBe(1); // Only deleted
    expect($withTrashedCount)->toBe(2); // Both
});
