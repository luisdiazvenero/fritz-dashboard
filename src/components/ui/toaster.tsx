import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ToastProvider } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";


export function Toaster() {
  const { toasts, dismiss } = useToast()
  
  // Eliminamos duplicados basados en ID
  const uniqueToasts = toasts.reduce((acc, current) => {
    const x = acc.find(item => item.id === current.id);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  // Crear contenedor si no existe
  let container = document.getElementById('tldx-toast-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'tldx-toast-container'
    document.body.appendChild(container)
  }

  // Asegurarse de que el contenedor tenga los estilos correctos sin afectar otros portales
  container.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 99;
    max-width: 420px;
    pointer-events: auto;
  `

  const handleDismiss = (toastId) => {
    const toastElement = document.querySelector(`[data-toast-id="${toastId}"]`);
    if (toastElement) {
      toastElement.style.opacity = '0';
      toastElement.style.transform = 'translateX(100%)'; // O cualquier dirección que prefieras
      setTimeout(() => {
        dismiss(toastId);
      }, 200); // El tiempo debe coincidir con la duración de la animación CSS
    }
  };
  

  useEffect(() => {
    const timers = toasts.map((toast) => {
      if (toast.duration) {
        return setTimeout(() => handleDismiss(toast.id), toast.duration);
      }
      return null;
    });
  
    return () => {
      timers.forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [toasts, dismiss, handleDismiss]);
  
  

  return createPortal(
    <ToastProvider>
      {uniqueToasts.map(({ id, title, description, icon, className }) => (
        <div
          key={id}
          data-toast-id={id}
          className={className}
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            marginBottom: '8px',
            width: '100%',
            minWidth: '300px',
            position: 'relative',
            transition: 'all 0.2s ease-out',
            animation: 'slide-in 0.2s ease-out',
            display: 'flex',
            alignItems: 'flex-start',
            pointerEvents: 'auto'
          }}
        >
          {icon && (
            <div className="flex-shrink-0" style={{ marginRight: '12px', marginTop: '2px' }}>
              {icon}
            </div>
          )}
          <div style={{ marginRight: '24px', flex: 1 }}>
            {title && (
              <div style={{ 
                fontWeight: 600,
                marginBottom: '4px',
                fontSize: '14px'
              }}>
                {title}
              </div>
            )}
            {description && (
              <div style={{ 
                fontSize: '14px',
                color: '#374151'
              }}>
                {description}
              </div>
            )}
          </div>
          <button
            onClick={() => handleDismiss(id)}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#4B5563',
              padding: '4px',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: '0.7',
              transition: 'opacity 0.2s ease',
              pointerEvents: 'auto'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
          >
            ×
          </button>
        </div>
      ))}
    </ToastProvider>,
    container
  )
}