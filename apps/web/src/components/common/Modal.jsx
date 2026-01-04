import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import styles from './Modal.module.css';
import clsx from 'clsx';
import Button from './Button';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  showCloseButton = true 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className={styles.overlay} style={{ pointerEvents: 'none' }}>
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              {(title || showCloseButton) && (
                <div className={styles.header}>
                  {title && <h2 className={styles.title}>{title}</h2>}
                  {showCloseButton && (
                    <button className={styles.closeButton} onClick={onClose} aria-label="Close">
                      <X size={24} />
                    </button>
                  )}
                </div>
              )}
              
              <div className={styles.content}>
                {children}
              </div>

              {footer && (
                <div className={styles.footer}>
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
