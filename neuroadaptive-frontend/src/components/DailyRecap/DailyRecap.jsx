import React from 'react';
import styles from './DailyRecap.module.css';
import Button from '../Button/Button';
import ProgressBar from '../ProgressBar/ProgressBar';

const DailyRecap = ({
  steps = [],
  completedSteps = [],
  onClose,
  onReset
}) => {
  const completedCount = completedSteps.length;
  const totalSteps = steps.length;
  const completionPercentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;
  
  const completedStepsList = completedSteps.map(index => {
    const step = steps[index];
    if (typeof step === 'object') {
      return step.action || step.description || 'Step completed';
    }
    return step;
  }).filter(Boolean);
  const remainingSteps = steps.filter((_, index) => !completedSteps.includes(index)).map(step => {
    if (typeof step === 'object') {
      return step.action || step.description || 'Remaining step';
    }
    return step;
  });

  const getMotivationalMessage = () => {
    if (completionPercentage === 100) {
      return "🎉 Outstanding! You've completed all your tasks today!";
    } else if (completionPercentage >= 75) {
      return "🌟 Great progress! You're almost there!";
    } else if (completionPercentage >= 50) {
      return "💪 Good momentum! Keep pushing forward!";
    } else if (completionPercentage >= 25) {
      return "🌱 Every step counts! You're building momentum!";
    } else if (completedCount > 0) {
      return "✨ You've taken the first steps! That's what matters!";
    } else {
      return "🚀 Ready to start? Your journey begins with the first step!";
    }
  };

  const getProgressVariant = () => {
    if (completionPercentage >= 75) return 'success';
    if (completionPercentage >= 50) return 'primary';
    if (completionPercentage >= 25) return 'warning';
    return 'secondary';
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <div className={styles.recapIcon}>📊</div>
            <div>
              <h1 className={styles.title}>Your Progress Today</h1>
              <p className={styles.subtitle}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className={styles.backButton}
            aria-label="Go back to tasks"
          >
            <span className={styles.backIcon}>←</span>
            <span>Back</span>
          </button>
        </div>
      </header>

      <main className={styles.content}>
        {/* Progress Overview */}
        <section className={styles.progressCard}>
          <div className={styles.progressOverview}>
            <div className={styles.progressVisual}>
              <div 
                className={styles.progressRing}
                style={{ '--progress': completionPercentage }}
              >
                <div className={styles.progressPercent}>
                  {Math.round(completionPercentage)}%
                </div>
              </div>
            </div>
            
            <div className={styles.progressInfo}>
              <h2 className={styles.progressTitle}>Your Progress</h2>
              <div className={styles.progressStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{completedCount}</span>
                  <span className={styles.statLabel}>Completed</span>
                </div>
                <div className={styles.statDivider}>of</div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{totalSteps}</span>
                  <span className={styles.statLabel}>Total</span>
                </div>
              </div>
              
              <div className={styles.motivationalMessage}>
                {getMotivationalMessage()}
              </div>
            </div>
          </div>
        </section>

        {/* Task Summary Grid */}
        <section className={styles.taskSummary}>
          <h2 className={styles.summaryTitle}>Task Summary</h2>
          
          <div className={styles.summaryGrid}>
            {/* Completed Tasks */}
            <div className={styles.summaryCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>✅</span>
                <h3 className={styles.cardTitle}>Completed</h3>
                <span className={styles.cardBadge}>{completedCount}</span>
              </div>
              
              {completedStepsList.length > 0 ? (
                <div className={styles.taskGrid}>
                  {completedStepsList.slice(0, 6).map((step, index) => (
                    <div key={index} className={`${styles.taskCard} ${styles.completedTask}`}>
                      <span className={styles.taskIcon}>✓</span>
                      <span className={styles.taskText}>{step}</span>
                    </div>
                  ))}
                  {completedStepsList.length > 6 && (
                    <div className={styles.moreIndicator}>
                      +{completedStepsList.length - 6} more completed
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.emptyMessage}>
                  <span className={styles.emptyIcon}>🎯</span>
                  <p>No tasks completed yet</p>
                </div>
              )}
            </div>

            {/* Remaining Tasks */}
            <div className={styles.summaryCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>⏳</span>
                <h3 className={styles.cardTitle}>Remaining</h3>
                <span className={styles.cardBadge}>{remainingSteps.length}</span>
              </div>
              
              {remainingSteps.length > 0 ? (
                <div className={styles.taskGrid}>
                  {remainingSteps.slice(0, 6).map((step, index) => (
                    <div key={index} className={`${styles.taskCard} ${styles.remainingTask}`}>
                      <span className={styles.taskIcon}>○</span>
                      <span className={styles.taskText}>{step}</span>
                    </div>
                  ))}
                  {remainingSteps.length > 6 && (
                    <div className={styles.moreIndicator}>
                      +{remainingSteps.length - 6} more remaining
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.emptyMessage}>
                  <span className={styles.emptyIcon}>🎉</span>
                  <p>All tasks completed!</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className={styles.actionsCard}>
          <h2 className={styles.actionsTitle}>What's Next?</h2>
          
          <div className={styles.actionButtons}>
            <button 
              onClick={onClose}
              className={`${styles.actionBtn} ${styles.primaryAction}`}
            >
              <span className={styles.actionIcon}>🎯</span>
              <div className={styles.actionContent}>
                <span className={styles.actionLabel}>Continue Working</span>
                <span className={styles.actionDesc}>Back to your tasks</span>
              </div>
            </button>
            
            {completedCount > 0 && (
              <button 
                onClick={onReset}
                className={`${styles.actionBtn} ${styles.secondaryAction}`}
              >
                <span className={styles.actionIcon}>🔄</span>
                <div className={styles.actionContent}>
                  <span className={styles.actionLabel}>Start Fresh</span>
                  <span className={styles.actionDesc}>Begin new tasks</span>
                </div>
              </button>
            )}
          </div>
          
          {completedCount > 0 && (
            <div className={styles.celebrationMessage}>
              <span className={styles.celebrationIcon}>🌟</span>
              <p>Great progress today! Every step counts toward your goals.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DailyRecap;