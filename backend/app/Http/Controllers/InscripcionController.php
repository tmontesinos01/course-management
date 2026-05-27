<?php

namespace App\Http\Controllers;

use App\Http\Requests\InscripcionRequest;
use App\Http\Resources\InscripcionResource;
use App\Services\InscripcionService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InscripcionController extends Controller
{
    use ApiResponse;

    protected $service;

    public function __construct(InscripcionService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request): JsonResponse
    {
        $perPage = $request->integer('per_page', 15);
        $inscripciones = $this->service->paginate($perPage);
        return $this->paginated(InscripcionResource::collection($inscripciones));
    }

    public function store(InscripcionRequest $request): JsonResponse
    {
        $inscripcion = $this->service->create($request->validated());
        return $this->created(new InscripcionResource($inscripcion));
    }

    public function show($id): JsonResponse
    {
        $inscripcion = \App\Models\Inscripcion::with(['curso', 'participante'])->findOrFail($id);
        return $this->success(new InscripcionResource($inscripcion));
    }

    public function update(InscripcionRequest $request, $id): JsonResponse
    {
        $inscripcion = $this->service->update($id, $request->validated());
        return $this->success(new InscripcionResource($inscripcion), 'Inscripcion actualizada exitosamente');
    }

    public function destroy($id): JsonResponse
    {
        $inscripcion = \App\Models\Inscripcion::findOrFail($id);
        $inscripcion->delete();
        return $this->noContent('Inscripcion eliminada exitosamente');
    }
}
