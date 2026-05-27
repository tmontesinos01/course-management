<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Estudiante extends Model
{
    use SoftDeletes;
    protected $table = 'estudiantes';
    protected $fillable = [
        'apellido_y_nombre',
        'matricula',
        'dni',
        'correo',
        'telefono',
        'observacion',
        'fecha_log',
        'fecha_alta',
        'user_log',
        'agremiado'
    ];
    
    protected $casts = [
        'fecha_log' => 'datetime',
        'fecha_alta' => 'datetime',
        'agremiado' => 'boolean'
    ];
}
