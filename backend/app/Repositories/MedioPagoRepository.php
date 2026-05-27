<?php

namespace App\Repositories;

use App\Models\MedioPago;
use App\Repositories\Interfaces\MedioPagoRepositoryInterface;

class MedioPagoRepository extends Repository implements MedioPagoRepositoryInterface
{
    public function __construct(MedioPago $model)
    {
        parent::__construct($model);
    }
}
