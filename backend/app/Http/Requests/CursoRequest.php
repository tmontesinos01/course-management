<?php

namespace App\Http\Requests;

use App\Enums\EstadoCurso;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CursoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:255',
            'cupos' => 'required|integer|min:1',
            'importe' => 'required|numeric|min:0',
            'fecha_desde' => 'required|date',
            'fecha_hasta' => 'required|date|after_or_equal:fecha_desde',
            'estado' => ['required', Rule::enum(EstadoCurso::class)],
            'tipo_curso' => 'required|in:Varios,Charla,Formacion profesional',
            'user_log' => 'nullable|exists:users,id'
        ];
    }
}
