// src/store/importStore.js
import { create } from 'zustand';

const useImportStore = create((set) => ({
  imports: [],
  loading: false,
  error: null,
  
  addImport: (importData) => 
    set((state) => ({ 
      imports: [importData, ...state.imports].slice(0, 10)
    })),
    
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  clearImports: () => set({ imports: [] }),
}));

export default useImportStore;