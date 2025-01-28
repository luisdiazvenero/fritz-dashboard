// src/store/metricsStore.js
import { create } from 'zustand';
import { api } from '../lib/api';
import { fetchWebMetricsAPI } from '../lib/api';

// Constantes de configuración
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos
const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutos en milisegundos

const useMetricsStore = create((set, get) => ({
  web: {
    data: [],
    isLoading: false,
    error: null,
    lastUpdated: null,
    refreshInterval: null
  },
  social: {
    data: [],
    isLoading: false,
    error: null,
    lastUpdated: null,
    refreshInterval: null
  },
  media: {
    data: [],
    isLoading: false,
    error: null,
    lastUpdated: null,
    refreshInterval: null
  },

  // Control de auto-actualización
  startAutoRefresh: (metricType) => {
    const currentState = get()[metricType];
    
    // Limpiar intervalo existente si hay uno
    if (currentState.refreshInterval) {
      clearInterval(currentState.refreshInterval);
    }

    // Crear nuevo intervalo según el tipo de métrica
    const interval = setInterval(() => {
      switch (metricType) {
        case 'web':
          get().fetchWebMetrics();
          break;
        case 'social':
          get().fetchSocialMetrics();
          break;
        case 'media':
          get().fetchMediaMetrics();
          break;
        default:
          break;
      }
    }, AUTO_REFRESH_INTERVAL);

    // Guardar referencia del intervalo
    set((state) => ({
      [metricType]: {
        ...state[metricType],
        refreshInterval: interval
      }
    }));
  },

  stopAutoRefresh: (metricType) => {
    const currentState = get()[metricType];
    if (currentState.refreshInterval) {
      clearInterval(currentState.refreshInterval);
      set((state) => ({
        [metricType]: {
          ...state[metricType],
          refreshInterval: null
        }
      }));
    }
  },

// Métricas Web
fetchWebMetrics: async (dateRange = {}, forceRefresh = false) => {
  try {
    set((state) => ({
      web: {
        ...state.web,
        isLoading: true,
        error: null,
      },
    }));

    // Preparar parámetros de consulta para el backend
    const params = dateRange.start && dateRange.end
      ? { startDate: dateRange.start, endDate: dateRange.end }
      : {};
    const data = await api.web.getAll(params);

    set((state) => ({
      web: {
        ...state.web,
        data,
        isLoading: false,
        lastUpdated: new Date().toISOString(),
      },
    }));

    return data;
  } catch (error) {
    console.error('Error fetching web metrics:', error);
    set((state) => ({
      web: {
        ...state.web,
        isLoading: false,
        error: 'Error al cargar las métricas web',
      },
    }));
    throw error;
  }
},


  

  // Métricas Sociales
  fetchSocialMetrics: async (dateRange = {}, forceRefresh = false) => {
    try {
      set((state) => ({
        social: {
          ...state.social,
          isLoading: true,
          error: null,
        },
      }));
  
      // Preparar parámetros de consulta para el backend
      const params = dateRange.start && dateRange.end
        ? { startDate: dateRange.start, endDate: dateRange.end }
        : {};
      const data = await api.social.getAll(params);
  
      set((state) => ({
        social: {
          ...state.social,
          data,
          isLoading: false,
          lastUpdated: new Date().toISOString(),
        },
      }));
  
      return data;
    } catch (error) {
      console.error('Error fetching social metrics:', error);
      set((state) => ({
        social: {
          ...state.social,
          isLoading: false,
          error: 'Error al cargar las métricas sociales',
        },
      }));
      throw error;
    }
  },
  

  // Métricas de Media
  fetchMediaMetrics: async (dateRange = {}, forceRefresh = false) => {
    try {
      set((state) => ({
        media: {
          ...state.media,
          isLoading: true,
          error: null,
        },
      }));
  
      // Preparar parámetros de consulta para el backend
      const params = dateRange.start && dateRange.end
        ? { startDate: dateRange.start, endDate: dateRange.end }
        : {};
      const data = await api.media.getAll(params);
  
      set((state) => ({
        media: {
          ...state.media,
          data,
          isLoading: false,
          lastUpdated: new Date().toISOString(),
        },
      }));
  
      return data;
    } catch (error) {
      console.error('Error fetching media metrics:', error);
      set((state) => ({
        media: {
          ...state.media,
          isLoading: false,
          error: 'Error al cargar las métricas de medios',
        },
      }));
      throw error;
    }
  },
  

  // Reset store
  resetMetrics: () => {
    const { stopAutoRefresh } = get();
    ['web', 'social', 'media'].forEach(metricType => {
      stopAutoRefresh(metricType);
    });

    set({
      web: { data: null, isLoading: false, error: null, lastUpdated: null, refreshInterval: null },
      social: { data: null, isLoading: false, error: null, lastUpdated: null, refreshInterval: null },
      media: { data: null, isLoading: false, error: null, lastUpdated: null, refreshInterval: null }
    });
  }
}));

export const fetchWebMetrics = async () => {
  try {
      const data = await fetchWebMetricsAPI();
      setWebMetricsData(data); // Función existente que almacena el estado
  } catch (error) {
      setError('Error al cargar métricas web'); // También existente
      console.error('Error en fetchWebMetrics:', error);
  }
};

export default useMetricsStore;