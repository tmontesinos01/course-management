<?php

namespace App\Services;

use App\Repositories\Interfaces\EstudianteRepositoryInterface;

class EstudianteService extends BaseService
{
    public function __construct(EstudianteRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }
}
