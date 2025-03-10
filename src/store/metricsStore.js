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
  fetchSocialMetrics: async (dateRange = {}, account = null, forceRefresh = false) => {
    try {
      
      set((state) => ({
        social: {
          ...state.social,
          isLoading: true,
          error: null,
        },
      }));
  
    
      if (account === null) {
        // 🔹 Obtener datos de todas las redes sociales (sin filtro de cuenta)
        const generalResponse = await api.social.getAll({ type: "Redes Sociales", ...dateRange });

      
        set((state) => ({
          social: {
            ...state.social,
            data: generalResponse.success ? generalResponse.data : [],
            isLoading: false,
            lastUpdated: new Date().toISOString(),
          },
        }));
      } else {
        let allData = []; // ✅ Se declara solo una vez

        // 🔹 Solicitar datos específicos de Instagram (CON account)
        const response = await api.social.getAll({ type: "Redes Sociales", ...dateRange });

        if (!response.success) {
          console.error("❌ Error obteniendo métricas sociales:", response);
          return;
        }

        allData = response.data; // ✅ Corrección: solo asignación, no redeclaración

        // Filtrar Instagram por cuenta específica
        if (account) {
          allData = allData.filter(item => item.category !== "Instagram" || item.account === account);
        }

        

        // 🔹 Eliminar duplicados verificando la combinación de category, metric y date (sin importar mayúsculas/minúsculas ni espacios adicionales)
const uniqueDataArray = Array.from(
  new Map(
    allData.map(item => [`${item.category.trim().toLowerCase()}-${item.metric.trim().toLowerCase()}-${item.date}`, item])
  ).values()
);



set((state) => ({
  social: {
    ...state.social,
    data: [
      ...state.social.data.filter(item => !(item.category === "Instagram" && item.account)), 
      ...uniqueDataArray
    ], // 🔹 Mantiene los datos previos y solo reemplaza los que tienen `account`
    isLoading: false,
    lastUpdated: new Date().toISOString(),
  },
}));


      }
    } catch (error) {
      console.error("Error fetching social metrics:", error);
      set((state) => ({
        social: {
          ...state.social,
          isLoading: false,
          error: "Error al cargar las métricas sociales",
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