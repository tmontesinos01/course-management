<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    protected function success($data = null, string $message = 'OK', int $status = 200): JsonResponse
    {
        return response()->json([
            'status' => $status,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    protected function paginated($resource, string $message = 'OK'): JsonResponse
    {
        $paginated = $resource->response()->getData(true);
        return response()->json([
            'status' => 200,
            'message' => $message,
            'data' => $paginated['data'],
            'meta' => $paginated['meta'] ?? null,
            'links' => $paginated['links'] ?? null,
        ], 200);
    }

    protected function created($data = null, string $message = 'Recurso creado exitosamente'): JsonResponse
    {
        return $this->success($data, $message, 201);
    }

    protected function noContent(string $message = 'Recurso eliminado exitosamente'): JsonResponse
    {
        return response()->json([
            'status' => 200,
            'message' => $message,
            'data' => null,
        ], 200);
    }

    protected function error(string $message = 'Error', int $status = 400, $errors = null): JsonResponse
    {
        return response()->json([
            'status' => $status,
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }
}
