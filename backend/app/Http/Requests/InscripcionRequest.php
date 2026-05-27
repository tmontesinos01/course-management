<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class InscripcionRequest extends FormRequest
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
            'id_curso' => 'required|exists:cursos,id',
            'id_participante' => 'required|exists:estudiantes,id',
            'user_log' => 'nullable|exists:users,id'
        ];
    }
}
