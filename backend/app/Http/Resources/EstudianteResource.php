<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EstudianteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'apellido_y_nombre' => $this->apellido_y_nombre,
            'matricula' => $this->matricula,
            'dni' => $this->dni,
            'correo' => $this->correo,
            'telefono' => $this->telefono,
            'observacion' => $this->observacion,
            'agremiado' => $this->agremiado,
            'fecha_alta' => $this->fecha_alta?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
