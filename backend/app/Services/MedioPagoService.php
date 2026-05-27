<?php

namespace App\Services;

use App\Repositories\Interfaces\MedioPagoRepositoryInterface;

class MedioPagoService extends BaseService
{
    public function __construct(MedioPagoRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }
}
