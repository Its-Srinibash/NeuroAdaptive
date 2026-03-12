import React from 'react';
import styles from './ProgressBar.module.css';

const ProgressBar = ({ 
  current = 0, 
  total = 100, 
  label = '',
  showPercentage = true,
  size = 'medium',
  variant = 'primary'
}) => {
  const percentage = Math.min(Math.max((current / total) * 100, 0), 100);
  const progressClasses = [
    styles.progressContainer,
    styles[size],
    styles[variant]
  ].join(' ');

  return (
    <div className={progressClasses} role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total}>
      {(label || showPercentage) && (
        <div className={styles.progressHeader}>
          {label && <span className={styles.progressLabel}>{label}</span>}
          {showPercentage && (
            <span className={styles.progressPercentage}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={styles.progressTrack}>
        <div 
          className={styles.progressFill}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;