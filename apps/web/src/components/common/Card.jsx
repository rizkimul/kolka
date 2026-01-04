import React from 'react';
import styles from './Card.module.css';
import clsx from 'clsx';

const Card = ({ 
  children, 
  className, 
  hoverable = false, 
  variant = 'default', // default, bordered, subject, predicate, object, adverb
  ...props 
}) => {
  return (
    <div 
      className={clsx(
        styles.card, 
        hoverable && styles.hoverable,
        styles[variant],
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
