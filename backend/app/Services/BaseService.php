<?php

namespace App\Services;

use App\Repositories\Interfaces\RepositoryInterface;

abstract class BaseService
{
    protected RepositoryInterface $repository;

    public function __construct(RepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAll()
    {
        return $this->repository->all();
    }

    public function paginate(int $perPage = 15)
    {
        return $this->repository->paginate($perPage);
    }

    public function getById($id)
    {
        return $this->repository->find($id);
    }

    public function create(array $data)
    {
        $data['fecha_alta'] = now();
        $data['fecha_log'] = now();
        return $this->repository->create($data);
    }

    public function update($id, array $data)
    {
        $data['fecha_log'] = now();
        return $this->repository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->repository->delete($id);
    }
}
