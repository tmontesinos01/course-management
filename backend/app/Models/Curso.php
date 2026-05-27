<?php

namespace App\Models;

use App\Enums\EstadoCurso;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Curso extends Model
{
    use SoftDeletes;
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
        'importe' => 'decimal:2',
        'estado' => EstadoCurso::class
    ];

    public function inscripciones()
    {
        return $this->hasMany(Inscripcion::class, 'id_curso');
    }
}
