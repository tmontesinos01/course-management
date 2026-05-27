<?php

namespace App\Http\Controllers;

use App\Http\Requests\EstudianteRequest;
use App\Http\Resources\EstudianteResource;
use App\Services\EstudianteService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EstudianteController extends Controller
{
    use ApiResponse;

    protected $service;

    public function __construct(EstudianteService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request): JsonResponse
    {
        $perPage = $request->integer('per_page', 15);
        $estudiantes = $this->service->paginate($perPage);
        return $this->paginated(EstudianteResource::collection($estudiantes));
    }

    public function store(EstudianteRequest $request): JsonResponse
    {
        $estudiante = $this->service->create($request->validated());
        return $this->created(new EstudianteResource($estudiante));
    }

    public function show($id): JsonResponse
    {
        $estudiante = \App\Models\Estudiante::findOrFail($id);
        return $this->success(new EstudianteResource($estudiante));
    }

    public function update(EstudianteRequest $request, $id): JsonResponse
    {
        $estudiante = \App\Models\Estudiante::findOrFail($id);
        $estudiante->update($request->validated());
        return $this->success(new EstudianteResource($estudiante), 'Estudiante actualizado exitosamente');
    }

    public function destroy($id): JsonResponse
    {
        $estudiante = \App\Models\Estudiante::findOrFail($id);
        $estudiante->delete();
        return $this->noContent('Estudiante eliminado exitosamente');
    }
}
