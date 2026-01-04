import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'error', duration = 5000) => {
    const id = ++toastId;
    const newToast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showError = useCallback((message) => {
    return addToast(message, 'error');
  }, [addToast]);

  const showSuccess = useCallback((message) => {
    return addToast(message, 'success');
  }, [addToast]);

  const showWarning = useCallback((message) => {
    return addToast(message, 'warning');
  }, [addToast]);

  const showInfo = useCallback((message) => {
    return addToast(message, 'info');
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ 
      toasts, 
      addToast, 
      removeToast, 
      showError, 
      showSuccess, 
      showWarning, 
      showInfo 
    }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Export a singleton for use in non-component code (like api.js)
let toastRef = {
  showError: (msg) => console.error('Toast not initialized:', msg),
  showSuccess: (msg) => console.log('Toast not initialized:', msg),
  showWarning: (msg) => console.warn('Toast not initialized:', msg),
  showInfo: (msg) => console.info('Toast not initialized:', msg),
};

export const setToastRef = (ref) => {
  toastRef = ref;
};

export const toast = {
  error: (msg) => toastRef.showError(msg),
  success: (msg) => toastRef.showSuccess(msg),
  warning: (msg) => toastRef.showWarning(msg),
  info: (msg) => toastRef.showInfo(msg),
};
