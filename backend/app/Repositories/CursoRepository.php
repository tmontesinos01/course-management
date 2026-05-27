<?php

namespace App\Repositories;

use App\Models\Curso;
use App\Repositories\Interfaces\CursoRepositoryInterface;

class CursoRepository extends Repository implements CursoRepositoryInterface
{
    public function __construct(Curso $model)
    {
        parent::__construct($model);
    }
}
