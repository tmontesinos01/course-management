<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CursoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'cupos' => $this->cupos,
            'cupos_disponibles' => $this->when(
                $this->inscripciones_count !== null,
                fn () => $this->cupos - $this->inscripciones_count
            ),
            'importe' => $this->importe,
            'fecha_desde' => $this->fecha_desde?->format('Y-m-d'),
            'fecha_hasta' => $this->fecha_hasta?->format('Y-m-d'),
            'estado' => $this->estado instanceof \App\Enums\EstadoCurso
                ? $this->estado->value
                : $this->estado,
            'tipo_curso' => $this->tipo_curso,
            'fecha_alta' => $this->fecha_alta?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
