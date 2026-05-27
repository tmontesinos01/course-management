<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Estudiante extends Model
{
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
