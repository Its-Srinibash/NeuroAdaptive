import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  return (
    <div className={`${styles.container} ${styles[size]}`}>
      <div className={styles.spinner} aria-label="Loading">
        <div className={styles.spinnerCircle}></div>
      </div>
      <p className={styles.message} aria-live="polite">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;