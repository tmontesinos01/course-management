<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EstudianteRequest extends FormRequest
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
            'apellido_y_nombre' => 'required|string|max:255',
            'matricula' => 'nullable|string|max:50',
            'dni' => [
                'required',
                'string',
                'max:20',
                Rule::unique('estudiantes', 'dni')->ignore($this->route('estudiante')),
            ],
            'correo' => 'nullable|email|max:255',
            'telefono' => 'nullable|string|max:50',
            'observacion' => 'nullable|string',
            'agremiado' => 'boolean',
            'user_log' => 'nullable|exists:users,id'
        ];
    }
}
