<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CursoController;
use App\Http\Controllers\EstudianteController;
use App\Http\Controllers\InscripcionController;
use App\Http\Controllers\MedioPagoController;

// Rutas para Cursos
Route::apiResource('cursos', CursoController::class);

// Rutas para Estudiantes
Route::apiResource('estudiantes', EstudianteController::class);

// Rutas para Inscripciones
Route::apiResource('inscripciones', InscripcionController::class);

// Rutas para Medios de Pago
Route::apiResource('medios-pagos', MedioPagoController::class);
