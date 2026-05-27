<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inscripcion extends Model
{
    protected $table = 'inscripciones';
    protected $fillable = [
        'id_curso',
        'id_participante',
        'fecha_log',
        'fecha_alta',
        'user_log'
    ];
    
    protected $casts = [
        'fecha_log' => 'datetime',
        'fecha_alta' => 'datetime'
    ];
    
    public function curso()
    {
        return $this->belongsTo(Curso::class, 'id_curso');
    }
    
    public function participante()
    {
        return $this->belongsTo(Estudiante::class, 'id_participante');
    }
}
