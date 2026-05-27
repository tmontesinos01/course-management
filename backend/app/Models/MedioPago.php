<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MedioPago extends Model
{
    use SoftDeletes;
    protected $table = 'medios_pagos';
    protected $fillable = [
        'nombre',
        'descripcion',
        'activo',
        'fecha_log',
        'fecha_alta',
        'user_log'
    ];
    
    protected $casts = [
        'fecha_log' => 'datetime',
        'fecha_alta' => 'datetime',
        'activo' => 'boolean'
    ];
}
