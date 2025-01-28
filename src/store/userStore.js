// src/store/userStore.js
import { create } from 'zustand';
import { api } from '../lib/api';

const useUserStore = create((set, get) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  
  // Función helper para manejar errores
  handleError: (error) => {
    let errorMessage = 'Ha ocurrido un error';
    
    // Errores específicos de la API
    if (error.message.includes('Email ya registrado')) {
      errorMessage = 'El email ya está registrado en el sistema';
    } else if (error.message.includes('último administrador')) {
      errorMessage = 'No se puede eliminar el último administrador del sistema';
    } else if (error.message.includes('No autorizado')) {
      errorMessage = 'No tienes permisos para realizar esta acción';
    } else if (error.message.includes('Usuario no encontrado')) {
      errorMessage = 'El usuario no existe o ya fue eliminado';
    }
    
    set({ error: errorMessage, isLoading: false });
  },

  clearError: () => set({ error: null }),

  // CRUD Operations con mejor manejo de errores
  // En src/store/userStore.js
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await api.users.getAll();
      set({ users, isLoading: false });
      return users; // Aseguramos que retorne los usuarios
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error; // Re-lanzamos el error para manejarlo en el componente
    }
  },

  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const newUser = await api.users.create(userData);
      set(state => ({
        users: [...state.users, newUser],
        isLoading: false
      }));
      return newUser;
    } catch (error) {
      get().handleError(error);
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await api.users.update(id, userData);
      set(state => ({
        users: state.users.map(user => 
          user._id === id ? updatedUser : user
        ),
        selectedUser: null,
        isLoading: false
      }));
      return updatedUser;
    } catch (error) {
      get().handleError(error);
      throw error;
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const currentUser = get().users.find(u => u._id === id);
      if (currentUser?.role === 'admin') {
        const adminCount = get().users.filter(u => u.role === 'admin').length;
        if (adminCount <= 1) {
          throw new Error('No se puede eliminar el último administrador');
        }
      }
      
      await api.users.delete(id);
      set(state => ({
        users: state.users.filter(user => user._id !== id),
        isLoading: false
      }));
    } catch (error) {
      get().handleError(error);
      throw error;
    }
  }
}));

export default useUserStore;