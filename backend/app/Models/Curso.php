<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Curso extends Model
{
    protected $table = 'cursos';
    protected $fillable = [
        'nombre',
        'cupos',
        'importe',
        'fecha_desde',
        'fecha_hasta',
        'estado',
        'tipo_curso',
        'fecha_log',
        'fecha_alta',
        'user_log'
    ];
    
    protected $casts = [
        'fecha_desde' => 'date',
        'fecha_hasta' => 'date',
        'fecha_log' => 'datetime',
        'fecha_alta' => 'datetime',
        'importe' => 'decimal:2'
    ];
}
