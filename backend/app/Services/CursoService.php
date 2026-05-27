<?php

namespace App\Services;

use App\Repositories\Interfaces\CursoRepositoryInterface;

class CursoService extends BaseService
{
    public function __construct(CursoRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }
}
