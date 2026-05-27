import client from './client.js';

const createService = (endpoint) => ({
  async getAll(params = {}) {
    const response = await client.get(`/${endpoint}`, { params });
    return response.data;
  },

  async getById(id) {
    const response = await client.get(`/${endpoint}/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await client.post(`/${endpoint}`, data);
    return response.data;
  },

  async update(id, data) {
    const response = await client.put(`/${endpoint}/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await client.delete(`/${endpoint}/${id}`);
    return response.data;
  },
});

export const cursoService = createService('cursos');
export const estudianteService = createService('estudiantes');
export const inscripcionService = createService('inscripciones');
export const medioPagoService = createService('medios-pagos');
