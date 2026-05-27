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
        return $this->success(EstudianteResource::collection($estudiantes)->response()->getData(true));
    }

    public function store(EstudianteRequest $request): JsonResponse
    {
        $estudiante = $this->service->create($request->validated());
        return $this->created(new EstudianteResource($estudiante));
    }

    public function show($id): JsonResponse
    {
        $estudiante = $this->service->getById($id);
        if (!$estudiante) {
            return $this->error('Estudiante no encontrado', 404);
        }
        return $this->success(new EstudianteResource($estudiante));
    }

    public function update(EstudianteRequest $request, $id): JsonResponse
    {
        $estudiante = $this->service->update($id, $request->validated());
        if (!$estudiante) {
            return $this->error('Estudiante no encontrado', 404);
        }
        return $this->success(new EstudianteResource($estudiante), 'Estudiante actualizado exitosamente');
    }

    public function destroy($id): JsonResponse
    {
        $deleted = $this->service->delete($id);
        if (!$deleted) {
            return $this->error('Estudiante no encontrado', 404);
        }
        return $this->noContent('Estudiante eliminado exitosamente');
    }
}
