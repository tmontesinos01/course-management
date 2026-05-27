<?php

namespace App\Repositories;

use App\Models\Estudiante;
use App\Repositories\Interfaces\EstudianteRepositoryInterface;

class EstudianteRepository extends Repository implements EstudianteRepositoryInterface
{
    public function __construct(Estudiante $model)
    {
        parent::__construct($model);
    }
}
