import { useLayoutEffect } from 'react';
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useToast, setToastRef } from '../../context/ToastContext';
import styles from './Toast.module.css';

const icons = {
  error: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
};

function ToastItem({ toast, onRemove }) {
  const Icon = icons[toast.type] || AlertCircle;
  
  return (
    <div className={`${styles.toast} ${styles[toast.type]}`}>
      <Icon className={styles.icon} size={20} />
      <span className={styles.message}>{toast.message}</span>
      <button 
        className={styles.closeBtn}
        onClick={() => onRemove(toast.id)}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts, removeToast, showError, showSuccess, showWarning, showInfo } = useToast();

  // Initialize the singleton ref for use in api.js
  // This MUST run before any early returns
  useLayoutEffect(() => {
    setToastRef({ showError, showSuccess, showWarning, showInfo });
  }, [showError, showSuccess, showWarning, showInfo]);

  return (
    <div className={styles.container}>
      {toasts.map(toast => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onRemove={removeToast} 
        />
      ))}
    </div>
  );
}

