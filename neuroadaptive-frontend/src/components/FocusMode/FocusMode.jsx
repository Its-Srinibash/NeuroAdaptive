import React from 'react';
import styles from './FocusMode.module.css';

const FocusMode = ({
  steps = [],
  currentStep = 0,
  completedSteps = [],
  undoHistory = [],
  onStepComplete,
  onNavigateStep,
  onUndo,
  onExit
}) => {
  
  const isStepCompleted = (index) => completedSteps.includes(index);
  const currentStepCompleted = isStepCompleted(currentStep);
  const totalSteps = steps.length;
  const completionPercentage = totalSteps > 0 ? (completedSteps.length / totalSteps) * 100 : 0;

  const getCurrentStepContent = () => {
    const step = steps[currentStep];
    if (typeof step === 'object') {
      return {
        action: step.action || step.description || 'No action available',
        description: step.description && step.action ? step.description : null
      };
    }
    return { action: step, description: null };
  };
  
  if (steps.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎯</div>
          <h2>Focus Mode Ready</h2>
          <p>Create some tasks first to start your focused work session.</p>
          <button onClick={onExit} className={styles.primaryBtn}>
            Create Tasks
          </button>
        </div>
      </div>
    );
  }

  const stepContent = getCurrentStepContent();

  return (
    <div className={styles.container}>
      {/* Header with Navigation */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.focusIndicator}>
            <span className={styles.focusIcon}>🎯</span>
            <span className={styles.focusLabel}>Focus Mode</span>
          </div>
          
          {/* Navigation Controls */}
          <div className={styles.headerNavigation}>
            <button
              onClick={() => onNavigateStep('previous')}
              disabled={currentStep === 0}
              className={`${styles.navBtn} ${styles.headerNavBtn}`}
            >
              <span className={styles.navIcon}>←</span>
              <span>Previous</span>
            </button>
            
            <div className={styles.stepCounter}>
              <span>{currentStep + 1} of {totalSteps}</span>
            </div>
            
            <button
              onClick={() => onNavigateStep('next')}
              disabled={currentStep === totalSteps - 1}
              className={`${styles.navBtn} ${styles.headerNavBtn}`}
            >
              <span>Next</span>
              <span className={styles.navIcon}>→</span>
            </button>
          </div>
        </div>
        
        <button onClick={onExit} className={styles.exitBtn}>
          <span>Exit</span>
          <span className={styles.exitIcon}>×</span>
        </button>
      </header>

      {/* Progress Ring */}
      <div className={styles.progressContainer}>
        <div className={styles.progressRing}>
          <svg className={styles.progressSvg} viewBox="0 0 100 100">
            <circle 
              className={styles.progressBg}
              cx="50" cy="50" r="45"
              fill="transparent"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
            />
            <circle 
              className={styles.progressBar}
              cx="50" cy="50" r="45"
              fill="transparent"
              stroke="#4ade80"
              strokeWidth="4"
              strokeDasharray={`${completionPercentage * 2.83} 283`}
              transform="rotate(-90 50 50)"
              strokeLinecap="round"
            />
          </svg>
          <div className={styles.progressText}>
            <span className={styles.progressPercent}>{Math.round(completionPercentage)}%</span>
            <span className={styles.progressLabel}>Complete</span>
          </div>
        </div>
      </div>

      {/* Main Step Card */}
      <main className={styles.focusArea}>
        <div className={styles.stepContainer}>
          <div className={styles.stepHeader}>
            <div className={styles.stepNumberBadge}>
              <span>Step {currentStep + 1}</span>
              <span className={styles.stepTotal}>of {totalSteps}</span>
            </div>
            
            {currentStepCompleted && (
              <div className={styles.completedIndicator}>
                <span className={styles.checkIcon}>✓</span>
                <span>Completed</span>
              </div>
            )}
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>
                {stepContent.action}
              </h2>
              
              {stepContent.description && (
                <p className={styles.stepDescription}>
                  {stepContent.description}
                </p>
              )}
            </div>

            <div className={styles.stepActions}>
              {!currentStepCompleted ? (
                <button 
                  onClick={onStepComplete}
                  className={styles.completeBtn}
                >
                  <span className={styles.btnIcon}>✓</span>
                  <span>Mark Complete</span>
                </button>
              ) : (
                <div className={styles.completedState}>
                  <span className={styles.completedIcon}>✅</span>
                  <span>Step Completed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      {/* <nav className={styles.navigation}>
        <button
          onClick={() => onNavigateStep('previous')}
          disabled={currentStep === 0}
          className={`${styles.navBtn} ${styles.prevBtn}`}
        >
          <span className={styles.navIcon}>←</span>
          <span>Previous</span>
        </button>

        <div className={styles.stepIndicators}>
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => onNavigateStep('goto', index)}
              className={`${styles.stepDot} ${
                index === currentStep ? styles.activeDot : ''
              } ${
                isStepCompleted(index) ? styles.completedDot : ''
              }`}
              title={`Step ${index + 1}`}
            >
              {isStepCompleted(index) ? (
                <span className={styles.dotCheck}>✓</span>
              ) : (
                <span className={styles.dotNumber}>{index + 1}</span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => onNavigateStep('next')}
          disabled={currentStep === totalSteps - 1}
          className={`${styles.navBtn} ${styles.nextBtn}`}
        >
          <span>Next</span>
          <span className={styles.navIcon}>→</span>
        </button>
      </nav> */}

      {/* Bottom Utilities */}
      <div className={styles.utilities}>
        {undoHistory && undoHistory.length > 0 && (
          <button onClick={onUndo} className={styles.undoBtn}>
            <span className={styles.undoIcon}>↶</span>
            <span>Undo</span>
          </button>
        )}
        
        <div className={styles.sessionInfo}>
          <span className={styles.completedCount}>
            {completedSteps.length}/{totalSteps} steps completed
          </span>
        </div>
      </div>
    </div>
  );
};


export default FocusMode;