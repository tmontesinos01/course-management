<?php

use App\Enums\EstadoCurso;

test('EstadoCurso has correct values', function () {
    expect(EstadoCurso::Activo->value)->toBe('Activo');
    expect(EstadoCurso::Inactivo->value)->toBe('Inactivo');
    expect(EstadoCurso::Finalizado->value)->toBe('Finalizado');
    expect(EstadoCurso::Cancelado->value)->toBe('Cancelado');
});

test('EstadoCurso can be instantiated from value', function () {
    $estado = EstadoCurso::from('Activo');
    expect($estado)->toBe(EstadoCurso::Activo);
});

test('EstadoCurso has all cases', function () {
    $cases = EstadoCurso::cases();
    expect($cases)->toHaveCount(4);
});
