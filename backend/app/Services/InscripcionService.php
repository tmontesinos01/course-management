<?php

namespace App\Services;

use App\Models\Curso;
use App\Repositories\Interfaces\InscripcionRepositoryInterface;
use Illuminate\Validation\ValidationException;

class InscripcionService extends BaseService
{
    public function __construct(InscripcionRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    public function create(array $data)
    {
        $curso = Curso::findOrFail($data['id_curso']);

        $inscripcionesActuales = $curso->inscripciones()->count();

        if ($inscripcionesActuales >= $curso->cupos) {
            throw ValidationException::withMessages([
                'id_curso' => 'El curso no tiene cupos disponibles.',
            ]);
        }

        return parent::create($data);
    }
}
