<?php

namespace App\Repositories;

use App\Models\Inscripcion;
use App\Repositories\Interfaces\InscripcionRepositoryInterface;

class InscripcionRepository implements InscripcionRepositoryInterface
{
    protected $model;

    public function __construct(Inscripcion $model)
    {
        $this->model = $model;
    }

    public function all()
    {
        return $this->model->with(['curso', 'participante'])->get();
    }

    public function find($id)
    {
        return $this->model->with(['curso', 'participante'])->find($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $record = $this->model->find($id);
        if ($record) {
            $record->update($data);
            return $record;
        }
        return null;
    }

    public function delete($id)
    {
        $record = $this->model->find($id);
        if ($record) {
            return $record->delete();
        }
        return false;
    }
}
