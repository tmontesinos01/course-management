<?php

namespace App\Repositories;

use App\Models\Inscripcion;
use App\Repositories\Interfaces\InscripcionRepositoryInterface;

class InscripcionRepository extends Repository implements InscripcionRepositoryInterface
{
    public function __construct(Inscripcion $model)
    {
        parent::__construct($model);
    }

    public function all()
    {
        return $this->model->with(['curso', 'participante'])->get();
    }

    public function paginate(int $perPage = 15)
    {
        return $this->model->with(['curso', 'participante'])->paginate($perPage);
    }

    public function find($id)
    {
        return $this->model->with(['curso', 'participante'])->find($id);
    }
}
