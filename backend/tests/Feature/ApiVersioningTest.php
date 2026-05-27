<?php

test('API routes are prefixed with /api/v1/', function () {
    $response = $this->getJson('/api/v1/cursos');
    $response->assertStatus(200);
});

test('API routes without version prefix return 404', function () {
    $response = $this->getJson('/api/cursos');
    $response->assertStatus(404);
});

test('All resource routes have v1 prefix', function () {
    $endpoints = [
        '/api/v1/cursos',
        '/api/v1/estudiantes',
        '/api/v1/inscripciones',
        '/api/v1/medios-pagos',
    ];

    foreach ($endpoints as $endpoint) {
        $response = $this->getJson($endpoint);
        $response->assertStatus(200);
    }
});

test('Individual resource routes have v1 prefix', function () {
    \App\Models\Curso::factory()->create();
    \App\Models\Estudiante::factory()->create();
    \App\Models\MedioPago::factory()->create();

    $this->getJson('/api/v1/cursos/1')->assertStatus(200);
    $this->getJson('/api/v1/estudiantes/1')->assertStatus(200);
    $this->getJson('/api/v1/medios-pagos/1')->assertStatus(200);
});
