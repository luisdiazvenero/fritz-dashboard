// src/lib/api.js
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001/api';

const handleApiResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Error en la conexión con el servidor'
    }));
    throw new Error(error.message || 'Error en la petición');
  }
  return response.json();
};

export const api = {
  // Usuarios
  users: {
    getAll: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        return handleApiResponse(response);
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },

    getById: async (id) => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        return handleApiResponse(response);
      } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
      }
    },

    create: async (userData) => {
      try {
        const response = await fetch(`${API_BASE_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(userData)
        });
        return handleApiResponse(response);
      } catch (error) {
        console.error('Error creating user:', error);
        throw error;
      }
    },

    update: async (id, userData) => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(userData)
        });
        return handleApiResponse(response);
      } catch (error) {
        console.error('Error updating user:', error);
        throw error;
      }
    },

    delete: async (id) => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        return handleApiResponse(response);
      } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
      }
    }
  },

  // Métricas Web
  web: {
    getAll: async (params = {}) => {
      try {
        console.log('Fetching web metrics...');
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/api/metrics/web?${queryString}`);
        return handleApiResponse(response);
      } catch (error) {
        console.error('Error fetching web metrics:', error);
        throw error;
      }
    }
  },

  // Métricas Sociales
  social: {
    getAll: async (params = {}) => {
      try {
        console.log('Fetching social metrics...');
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/api/metrics/social?${queryString}`);
        return handleApiResponse(response);
      } catch (error) {
        console.error('Error fetching social metrics:', error);
        throw error;
      }
    }
  },

  // Métricas de Media
  media: {
    getAll: async (params = {}) => {
      try {
        console.log('Fetching media metrics...');
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/api/metrics/media?${queryString}`);
        return handleApiResponse(response);
      } catch (error) {
        console.error('Error fetching media metrics:', error);
        throw error;
      }
    }
  },

  // Resumen de Métricas
  metrics: {
    getSummary: async (params = {}) => {
      try {
        console.log('Fetching metrics summary...');
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/metrics/summary?${queryString}`);
        return handleApiResponse(response);
      } catch (error) {
        console.error('Error fetching metrics summary:', error);
        throw error;
      }
    }
  },

  // Importación de datos
  import: {
    uploadData: async (data) => {
      try {
        console.log('Uploading data...');
        const response = await fetch(`${API_BASE_URL}/import/data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        return handleApiResponse(response);
      } catch (error) {
        console.error('Error uploading data:', error);
        throw error;
      }
    }
  }
};

// Paso 1: Inspeccionar la API en 'api.js'
export const fetchWebMetricsAPI = async () => {
  try {
      const response = await fetch('/api/metrics/web'); // Endpoint
      if (!response.ok) {
          throw new Error('Error al obtener métricas');
      }
      return await response.json();
  } catch (error) {
      console.error('Error en fetchWebMetricsAPI:', error);
      throw error;
  }
};