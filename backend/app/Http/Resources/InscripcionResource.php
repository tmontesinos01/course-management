<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InscripcionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'id_curso' => $this->id_curso,
            'id_participante' => $this->id_participante,
            'curso' => new CursoResource($this->whenLoaded('curso')),
            'participante' => new EstudianteResource($this->whenLoaded('participante')),
            'fecha_alta' => $this->fecha_alta?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
