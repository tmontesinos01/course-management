<?php

namespace App\Enums;

enum EstadoCurso: string
{
    case Activo = 'Activo';
    case Inactivo = 'Inactivo';
    case Finalizado = 'Finalizado';
    case Cancelado = 'Cancelado';
}
