import React from 'react';
import styles from './StepList.module.css';
import Button from '../Button/Button';
import ProgressBar from '../ProgressBar/ProgressBar';

const StepList = ({
  steps = [],
  currentStep = 0,
  completedSteps = [],
  guidedMode = true,
  focusTime = '',
  onStepComplete,
  onToggleMode,
  onStartFocus,
  onShowRecap
}) => {
  const isStepCompleted = (index) => completedSteps.includes(index);
  const completedCount = completedSteps.length;
  const totalSteps = steps.length;

  if (steps.length === 0) return null;

  return (
    <div className={styles.container}>
      {/* Progress Section */}
      <div className={styles.progressSection}>
        <ProgressBar 
          current={completedCount} 
          total={totalSteps}
          label={`Progress: ${completedCount} of ${totalSteps} steps completed`}
          variant="primary"
          size="medium"
        />
      </div>

      {/* Controls Section */}
      <div className={styles.controlsSection}>
        <div className={styles.modeToggle}>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={guidedMode}
              onChange={onToggleMode}
              className={styles.toggleInput}
            />
            <span className={styles.toggleSlider}></span>
            <span className={styles.toggleText}>Step-by-step guidance</span>
          </label>
        </div>

        <div className={styles.actionButtons}>
          <Button 
            variant="secondary" 
            size="small"
            onClick={onStartFocus}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <circle cx="12" cy="12" r="11"/>
            </svg>
            Focus Mode
          </Button>
          
          <Button 
            variant="outline" 
            size="small"
            onClick={onShowRecap}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            Daily Recap
          </Button>
        </div>
      </div>

      {/* Steps Display */}
      {guidedMode ? (
        <GuidedStepView
          steps={steps}
          currentStep={currentStep}
          isCompleted={isStepCompleted(currentStep)}
          onStepComplete={onStepComplete}
        />
      ) : (
        <ListView
          steps={steps}
          completedSteps={completedSteps}
        />
      )}

      {/* Focus Time Suggestion */}
      {focusTime && (
        <div className={styles.focusTimeSuggestion}>
          <div className={styles.focusTimeIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
          </div>
          <div className={styles.focusTimeContent}>
            <span className={styles.focusTimeLabel}>Suggested focus window:</span>
            <span className={styles.focusTimeValue}>{focusTime}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const GuidedStepView = ({ steps, currentStep, isCompleted, onStepComplete }) => (
  <div className={styles.guidedContainer}>
    <div className={styles.stepHeader}>
      <span className={styles.stepCounter}>
        Step {currentStep + 1} of {steps.length}
      </span>
    </div>
    
    <div className={`${styles.currentStepCard} ${isCompleted ? styles.completedCard : ''}`}>
      <div className={styles.stepContent}>
        {isCompleted && (
          <div className={styles.completedIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17L4 12"/>
            </svg>
          </div>
        )}
        <p className={styles.stepText}>
          {steps[currentStep]}
        </p>
      </div>
      
      <Button
        variant={isCompleted ? "success" : "primary"}
        size="medium"
        onClick={onStepComplete}
        disabled={isCompleted}
        fullWidth
      >
        {isCompleted ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17L4 12"/>
            </svg>
            Completed
          </>
        ) : (
          'Mark as completed'
        )}
      </Button>
    </div>
  </div>
);

const ListView = ({ steps, completedSteps }) => (
  <div className={styles.listContainer}>
    <ol className={styles.stepsList}>
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(index);
        return (
          <li key={index} className={`${styles.stepItem} ${isCompleted ? styles.completedStep : ''}`}>
            <div className={styles.stepItemContent}>
              <div className={`${styles.stepMarker} ${isCompleted ? styles.completedMarker : ''}`}>
                {isCompleted ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17L4 12"/>
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className={styles.stepItemText}>
                {step}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  </div>
);

export default StepList;