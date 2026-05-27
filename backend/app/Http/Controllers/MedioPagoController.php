<?php

namespace App\Http\Controllers;

use App\Http\Requests\MedioPagoRequest;
use App\Http\Resources\MedioPagoResource;
use App\Services\MedioPagoService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedioPagoController extends Controller
{
    use ApiResponse;

    protected $service;

    public function __construct(MedioPagoService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request): JsonResponse
    {
        $perPage = $request->integer('per_page', 15);
        $mediosPagos = $this->service->paginate($perPage);
        return $this->paginated(MedioPagoResource::collection($mediosPagos));
    }

    public function store(MedioPagoRequest $request): JsonResponse
    {
        $medioPago = $this->service->create($request->validated());
        return $this->created(new MedioPagoResource($medioPago));
    }

    public function show($id): JsonResponse
    {
        $medioPago = \App\Models\MedioPago::findOrFail($id);
        return $this->success(new MedioPagoResource($medioPago));
    }

    public function update(MedioPagoRequest $request, $id): JsonResponse
    {
        $medioPago = $this->service->update($id, $request->validated());
        return $this->success(new MedioPagoResource($medioPago), 'Medio de pago actualizado exitosamente');
    }

    public function destroy($id): JsonResponse
    {
        $medioPago = \App\Models\MedioPago::findOrFail($id);
        $medioPago->delete();
        return $this->noContent('Medio de pago eliminado exitosamente');
    }
}
