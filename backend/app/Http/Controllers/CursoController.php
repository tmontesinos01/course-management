<?php

namespace App\Http\Controllers;

use App\Http\Requests\CursoRequest;
use App\Http\Resources\CursoResource;
use App\Services\CursoService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CursoController extends Controller
{
    use ApiResponse;

    protected $service;

    public function __construct(CursoService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request): JsonResponse
    {
        $perPage = $request->integer('per_page', 15);
        $cursos = $this->service->paginate($perPage);
        return $this->success(CursoResource::collection($cursos)->response()->getData(true));
    }

    public function store(CursoRequest $request): JsonResponse
    {
        $curso = $this->service->create($request->validated());
        return $this->created(new CursoResource($curso));
    }

    public function show($id): JsonResponse
    {
        $curso = $this->service->getById($id);
        if (!$curso) {
            return $this->error('Curso no encontrado', 404);
        }
        return $this->success(new CursoResource($curso));
    }

    public function update(CursoRequest $request, $id): JsonResponse
    {
        $curso = $this->service->update($id, $request->validated());
        if (!$curso) {
            return $this->error('Curso no encontrado', 404);
        }
        return $this->success(new CursoResource($curso), 'Curso actualizado exitosamente');
    }

    public function destroy($id): JsonResponse
    {
        $deleted = $this->service->delete($id);
        if (!$deleted) {
            return $this->error('Curso no encontrado', 404);
        }
        return $this->noContent('Curso eliminado exitosamente');
    }
}
