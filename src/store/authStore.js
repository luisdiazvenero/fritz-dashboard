import { create } from 'zustand';

let initializePromise = null;

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false, // Nuevo estado para controlar la inicialización
  
  initialize: async () => {
    if (initializePromise) {
      return initializePromise;
    }

    set({ isLoading: true });
    const token = localStorage.getItem('token');

    if (!token) {
      set({ 
        isAuthenticated: false, 
        user: null, 
        isLoading: false,
        isInitialized: true 
      });
      return;
    }

    initializePromise = (async () => {
      try {
        const response = await fetch('http://localhost:5001/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          localStorage.removeItem('token');
          set({ 
            isAuthenticated: false, 
            user: null, 
            isLoading: false,
            isInitialized: true 
          });
          return;
        }

        const userData = await response.json();
        set({ 
          user: {
            id: userData._id,
            email: userData.email,
            username: userData.username,
            role: userData.role,
            status: userData.status
          },
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
          error: null
        });
      } catch (error) {
        localStorage.removeItem('token');
        set({ 
          isAuthenticated: false, 
          user: null, 
          error: error.message,
          isLoading: false,
          isInitialized: true
        });
      } finally {
        initializePromise = null;
      }
    })();

    return initializePromise;
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error en la autenticación');
      }

      localStorage.setItem('token', data.token);
      
      set({ 
        user: { 
          id: data.id,
          email: data.email, 
          role: data.role,
          username: data.username,
          status: data.status
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isInitialized: true
      });
      return true;
    } catch (error) {
      localStorage.removeItem('token');
      set({ 
        error: error.message, 
        isLoading: false, 
        isAuthenticated: false, 
        user: null,
        isInitialized: true
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ 
      user: null, 
      isAuthenticated: false,
      error: null,
      isLoading: false,
      isInitialized: true
    });
  }
}));

export default useAuthStore;