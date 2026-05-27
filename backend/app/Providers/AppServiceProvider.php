<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Interfaces\CursoRepositoryInterface;
use App\Repositories\Interfaces\EstudianteRepositoryInterface;
use App\Repositories\Interfaces\InscripcionRepositoryInterface;
use App\Repositories\Interfaces\MedioPagoRepositoryInterface;
use App\Repositories\CursoRepository;
use App\Repositories\EstudianteRepository;
use App\Repositories\InscripcionRepository;
use App\Repositories\MedioPagoRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(CursoRepositoryInterface::class, CursoRepository::class);
        $this->app->bind(EstudianteRepositoryInterface::class, EstudianteRepository::class);
        $this->app->bind(InscripcionRepositoryInterface::class, InscripcionRepository::class);
        $this->app->bind(MedioPagoRepositoryInterface::class, MedioPagoRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
