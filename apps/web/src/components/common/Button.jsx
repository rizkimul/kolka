import React from 'react';
import styles from './Button.module.css';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

/**
 * Button Component
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'outline' | 'text'} [props.variant='primary']
 * @param {'small' | 'medium' | 'large'} [props.size='medium']
 * @param {boolean} [props.block=false] - Full width
 * @param {boolean} [props.loading=false]
 * @param {React.ReactNode} [props.icon]
 * @param {React.ReactNode} props.children
 */
const Button = ({ 
  variant = 'primary', 
  size = 'medium', 
  block = false,
  loading = false, 
  icon,
  className, 
  children, 
  disabled,
  ...props 
}) => {
  const classes = clsx(
    styles.button,
    styles[variant],
    styles[size],
    block && styles.block,
    className
  );

  return (
    <button 
      className={classes} 
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" size={20} />}
      {!loading && icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
