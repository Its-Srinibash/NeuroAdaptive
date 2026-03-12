import React, { useState, useCallback, useEffect } from "react";
import './styles/globals.css';

// Components
import TaskInput from './components/TaskInput/TaskInput';
import StepList from './components/StepList/StepList';
import FocusMode from './components/FocusMode/FocusMode';
import DailyRecap from './components/DailyRecap/DailyRecap';
import MeetingSummary from './components/MeetingSummary/MeetingSummary';
import ReadingSimplifier from './components/ReadingSimplifier/ReadingSimplifier';
import CalmCompanion from './components/CalmCompanion/CalmCompanion';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';

// Styles
import styles from './App.module.css';

function App() {
  // Core state management
  const [task, setTask] = useState("");
  const [steps, setSteps] = useState([]);
  const [focusTime, setFocusTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Mode states - simplified
  const [focusMode, setFocusMode] = useState(false);
  const [showRecap, setShowRecap] = useState(false);
  const [showMeetingSummary, setShowMeetingSummary] = useState(false);
  const [showReadingSimplifier, setShowReadingSimplifier] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Progress tracking
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [undoHistory, setUndoHistory] = useState([]);

  // Accessibility & Neurodiversity preferences
  const [preferences, setPreferences] = useState({
    highContrast: false,
    reducedMotion: false,
    largerText: false,
    simplifiedView: true,
    autoFocus: true,
    soundEnabled: false
  });

  // Load preferences from localStorage
  useEffect(() => {
    const savedPrefs = localStorage.getItem('neurodiversity-preferences');
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
  }, []);

  // Save preferences to localStorage
  const updatePreference = useCallback((key, value) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    localStorage.setItem('neurodiversity-preferences', JSON.stringify(newPrefs));
  }, [preferences]);

  const generateSteps = useCallback(async () => {
    if (!task.trim()) {
      setError("Please enter a task to get started.");
      return;
    }

    setLoading(true);
    setError("");
    setSteps([]);
    setFocusTime("");
    setCurrentStep(0);
    setCompletedSteps([]);
    setUndoHistory([]);
    setFocusMode(false);
    setShowRecap(false);
    setShowMeetingSummary(false);

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/task-breakdown",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ task })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.steps && Array.isArray(data.steps)) {
        setSteps(data.steps); // Keep original step objects
        setFocusTime(data.recommendedFocusTime || "");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error generating steps:", err);
      setError("Unable to connect to the AI service. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [task]);

  const markStepCompleted = useCallback(() => {
    if (!completedSteps.includes(currentStep)) {
      const previousState = {
        completedSteps: [...completedSteps],
        currentStep: currentStep,
        timestamp: Date.now()
      };
      setUndoHistory(prev => [...prev, previousState]);
      setCompletedSteps(prev => [...prev, currentStep]);
      
      // Positive feedback sound if enabled
      if (preferences.soundEnabled) {
        // Play success sound
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2');
        audio.play().catch(() => {});
      }
    }
  }, [currentStep, completedSteps, preferences.soundEnabled]);

  const undoLastAction = useCallback(() => {
    if (undoHistory.length > 0) {
      const lastState = undoHistory[undoHistory.length - 1];
      setCompletedSteps(lastState.completedSteps);
      setCurrentStep(lastState.currentStep);
      setUndoHistory(prev => prev.slice(0, -1));
    }
  }, [undoHistory]);

  const handleStepNavigation = useCallback((direction, targetIndex = null) => {
    if (direction === 'previous' && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (direction === 'next' && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (direction === 'goto' && targetIndex !== null) {
      setCurrentStep(Math.max(0, Math.min(steps.length - 1, targetIndex)));
    }
  }, [currentStep, steps.length]);



  const handleStartFocus = useCallback(() => {
    setFocusMode(true);
  }, []);

  const handleShowRecap = useCallback(() => {
    setShowRecap(true);
  }, []);

  const handleShowMeetingSummary = useCallback(() => {
    setShowMeetingSummary(true);
  }, []);

  const handleShowReadingSimplifier = useCallback(() => {
    setShowReadingSimplifier(true);
  }, []);



  const handleExitFocus = useCallback(() => {
    setFocusMode(false);
  }, []);

  const handleBackFromRecap = useCallback(() => {
    setShowRecap(false);
  }, []);

  const handleBackFromMeeting = useCallback(() => {
    setShowMeetingSummary(false);
  }, []);

  const handleBackFromReading = useCallback(() => {
    setShowReadingSimplifier(false);
  }, []);

  const resetApp = useCallback(() => {
    setTask("");
    setSteps([]);
    setFocusTime("");
    setError("");
    setCurrentStep(0);
    setCompletedSteps([]);
    setUndoHistory([]);
    setFocusMode(false);
    setShowRecap(false);
    setShowMeetingSummary(false);
    setShowReadingSimplifier(false);
  }, []);

  // Apply accessibility preferences to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (preferences.highContrast) {
      root.setAttribute('data-theme', 'high-contrast');
    } else {
      root.removeAttribute('data-theme');
    }
    
    if (preferences.reducedMotion) {
      root.style.setProperty('--transition-fast', '0ms');
      root.style.setProperty('--transition-normal', '0ms');
      root.style.setProperty('--transition-slow', '0ms');
    } else {
      root.style.removeProperty('--transition-fast');
      root.style.removeProperty('--transition-normal');
      root.style.removeProperty('--transition-slow');
    }
    
    if (preferences.largerText) {
      root.style.setProperty('--font-size-base', '1.125rem');
      root.style.setProperty('--font-size-lg', '1.375rem');
      root.style.setProperty('--font-size-xl', '1.5rem');
    } else {
      root.style.removeProperty('--font-size-base');
      root.style.removeProperty('--font-size-lg');
      root.style.removeProperty('--font-size-xl');
    }
  }, [preferences]);

  // Generated by GithubCopilot
  // Loading state - futuristic AI loading experience
  if (loading) {
    return (
      <div className={`${styles.loadingContainer} ${preferences.highContrast ? styles.highContrast : ''}`}>
        <div className={styles.loadingContent}>
          <LoadingSpinner 
            size="large"
            message="Analyzing your task with AI..."
          />
          <div className={styles.loadingDetails}>
            <p className={styles.loadingSubtext}>
              Neural networks are breaking down your request into optimal, manageable steps
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showReadingSimplifier) {
    return (
      <>
        <ReadingSimplifier
          onBack={handleBackFromReading}
          preferences={preferences}
        />
        <CalmCompanion />
      </>
    );
  }

  // Meeting Summary View
  if (showMeetingSummary) {
    return (
      <>
        <MeetingSummary
          onBack={handleBackFromMeeting}
          preferences={preferences}
        />
        <CalmCompanion />
      </>
    );
  }

  // Daily Recap View
  if (showRecap) {
    return (
      <>
        <DailyRecap
          steps={steps}
          completedSteps={completedSteps}
          onClose={handleBackFromRecap}
          onReset={resetApp}
        />
        <CalmCompanion />
        {/* <SettingsPanel /> */}
      </>
    );
  }

  // Focus Mode View - Enhanced for neurodiversity
  if (focusMode) {
    return (
      <>
        <FocusMode
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          undoHistory={undoHistory}
          onStepComplete={markStepCompleted}
          onNavigateStep={handleStepNavigation}
          onUndo={undoLastAction}
          onExit={handleExitFocus}
          preferences={preferences}
        />
        <CalmCompanion />
        {/* <SettingsPanel /> */}
      </>
    );
  }

  // Main App View - Modern & Accessible Design
  return (
    <div className={`${styles.app} ${preferences.highContrast ? styles.highContrast : ''} ${preferences.largerText ? styles.largerText : ''}`}>
      {/* Modern Header with Glassmorphism */}
      <header className={styles.modernHeader}>
        <div className={styles.headerContainer}>
          <div className={styles.brandSection}>
            <div className={styles.logoWrapper}>
              <div className={styles.logo}>N</div>
              <div className={styles.brandText}>
                <h1 className={styles.brandTitle}>NeuroAdaptive</h1>
                <p className={styles.brandSubtitle}>Mindful Productivity</p>
              </div>
            </div>
          </div>

        </div>
      </header>

      <div className={styles.modernContainer}>
        {steps.length === 0 ? (
          /* Modern Onboarding Experience */
          <div className={styles.onboardingSection}>
            <div className={styles.heroCard}>
              <div className={styles.heroContent}>
                <div className={styles.heroIcon}>
                  <div className={styles.iconPulse}>✨</div>
                </div>
                <h2 className={styles.heroTitle}>What's on your mind today?</h2>
                <p className={styles.heroDescription}>
                  Share any task, project, or challenge. I'll transform it into a calm, 
                  step-by-step journey that feels manageable and achievable.
                </p>
              </div>
              
              <div className={styles.inputSection}>
                <div className={styles.modernInputWrapper}>
                  {/* <div className={styles.inputLabel}>
                    <span className={styles.labelIcon}>💭</span>
                    <span>Describe your task or goal</span>
                  </div> */}
                  <textarea 
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="Example: Prepare quarterly report, organize my workspace, plan a birthday party..."
                    className={styles.modernTaskInput}
                    rows="4"
                  />
                  <div className={styles.inputActions}>
                    <button 
                      onClick={generateSteps}
                      disabled={!task.trim() || loading}
                      className={styles.primaryButton}
                    >
                      {loading ? (
                        <>
                          <div className={styles.buttonSpinner}></div>
                          <span>Creating your plan...</span>
                        </>
                      ) : (
                        <>
                          <span className={styles.buttonIcon}>🎯</span>
                          <span>Create My Action Plan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className={styles.modernError}>
                  <div className={styles.errorIcon}>⚠️</div>
                  <div className={styles.errorContent}>
                    <p className={styles.errorMessage}>{error}</p>
                    <button 
                      onClick={() => setError('')}
                      className={styles.errorDismiss}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modern Feature Cards */}
            <div className={styles.featureShowcase}>
              <div className={styles.showcaseHeader}>
                <h3 className={styles.showcaseTitle}>Or explore these specialized tools</h3>
                {/* <p className={styles.showcaseSubtitle}>Each designed with neurodiversity in mind</p> */}
              </div>
              
              <div className={styles.featureGrid}>
                <div className={styles.featureCard} onClick={handleShowMeetingSummary}>
                  <div className={styles.featureIconWrapper}>
                    <div className={styles.featureIconBg} style={{background: 'linear-gradient(135deg, #3b82f6, #1e40af)'}}>
                      <span className={styles.featureIcon}>📋</span>
                    </div>
                  </div>
                  <div className={styles.featureContent}>
                    <h4 className={styles.featureTitle}>Meeting Clarity</h4>
                    <p className={styles.featureDescription}>
                      Transform meeting chaos into organized action items, decisions, and deadlines.
                    </p>
                    <div className={styles.featureTags}>
                      <span className={styles.tag}>Action Items</span>
                      <span className={styles.tag}>Deadlines</span>
                    </div>
                  </div>
                  <div className={styles.featureArrow}>→</div>
                </div>

                {/* <div className={styles.featureCard} onClick={handleShowReadingSimplifier}>
                  <div className={styles.featureIconWrapper}>
                    <div className={styles.featureIconBg} style={{background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'}}>
                      <span className={styles.featureIcon}>📖</span>
                    </div>
                  </div>
                  <div className={styles.featureContent}>
                    <h4 className={styles.featureTitle}>Reading Simplifier</h4>
                    <p className={styles.featureDescription}>
                      Break down emails, documents, articles, or policies into digestible bullet points and key takeaways.
                    </p>
                    <div className={styles.featureTags}>
                      <span className={styles.tag}>Simple Language</span>
                      <span className={styles.tag}>Key Points</span>
                    </div>
                  </div>
                  <div className={styles.featureArrow}>→</div>
                </div> */}

                {/* <div className={`${styles.featureCard} ${styles.featureCardInfo}`}>
                  <div className={styles.featureIconWrapper}>
                    <div className={styles.featureIconBg} style={{background: 'linear-gradient(135deg, #4facfe, #00f2fe)'}}>
                      <span className={styles.featureIcon}>💙</span>
                    </div>
                  </div>
                  <div className={styles.featureContent}>
                    <h4 className={styles.featureTitle}>Calm Companion ⭐</h4>
                    <p className={styles.featureDescription}>
                      Always available in bottom-right corner. Click the floating widget for instant AI support & voice chat.
                    </p>
                    <div className={styles.featureTags}>
                      <span className={styles.tag}>Always Available</span>
                      <span className={styles.tag}>Voice Chat</span>
                      <span className={styles.tag}>Active</span>
                    </div>
                  </div>
                  <div className={styles.featureArrow}>→</div>
                </div> */}
              </div>
            </div>
          </div>
        ) : (
          /* Redesigned Modern Steps Interface */
          <div className={styles.stepsInterface}>
            {/* Enhanced Progress Dashboard */}
            <div className={styles.progressDashboard}>
              <div className={styles.progressHeader}>
                <h2 className={styles.progressTitle}>Your Progress</h2>
                <div className={styles.progressSummary}>
                  <span className={styles.progressText}>
                    {completedSteps.length} of {steps.length} steps completed
                  </span>
                </div>
              </div>
              
              <div className={styles.progressMetrics}>
                <div className={styles.metricCard}>
                  <div className={styles.metricIcon}>✅</div>
                  <div className={styles.metricContent}>
                    <div className={styles.metricNumber}>{completedSteps.length}</div>
                    <div className={styles.metricLabel}>Completed</div>
                  </div>
                </div>
                
                <div className={styles.progressDisplay}>
                  <div className={styles.progressCircle}>
                    <svg className={styles.progressSvg} viewBox="0 0 120 120">
                      <circle 
                        className={styles.progressTrack}
                        cx="60" cy="60" r="50"
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="8"
                      />
                      <circle 
                        className={styles.progressFill}
                        cx="60" cy="60" r="50"
                        fill="none"
                        stroke="url(#progressGradient)"
                        strokeWidth="8"
                        strokeDasharray={`${(completedSteps.length / steps.length) * 314.16} 314.16`}
                        transform="rotate(-90 60 60)"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className={styles.progressPercentage}>
                      <span className={styles.percentNumber}>
                        {Math.round((completedSteps.length / steps.length) * 100)}
                      </span>
                      <span className={styles.percentSign}>%</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.metricCard}>
                  <div className={styles.metricIcon}>📝</div>
                  <div className={styles.metricContent}>
                    <div className={styles.metricNumber}>{steps.length - completedSteps.length}</div>
                    <div className={styles.metricLabel}>Remaining</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Redesigned Main Layout */}
            <div className={styles.mainWorkspace}>
              {/* Primary Content Area */}
              <div className={styles.primaryContent}>
                {/* Current Step Card */}
                <div className={styles.currentStepCard}>
                  <div className={styles.stepCardHeader}>
                    <div className={styles.stepIndicator}>
                      <div className={styles.stepBadge}>
                        <span className={styles.stepBadgeText}>Step</span>
                        <span className={styles.stepBadgeNumber}>{currentStep + 1}</span>
                      </div>
                      {completedSteps.includes(currentStep) ? (
                        <div className={styles.statusCompleted}>
                          <div className={styles.statusIcon}>✓</div>
                          <span>Completed</span>
                        </div>
                      ) : (
                        <div className={styles.statusActive}>
                          <div className={styles.statusIcon}>●</div>
                          <span>Active</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.stepCardBody}>
                    <h3 className={styles.stepTaskTitle}>
                      {typeof steps[currentStep] === 'object' 
                        ? steps[currentStep].action || steps[currentStep].description || 'No action available'
                        : steps[currentStep]
                      }
                    </h3>
                    
                    {typeof steps[currentStep] === 'object' && steps[currentStep].description && steps[currentStep].action && (
                      <div className={styles.stepTaskDescription}>
                        <p>{steps[currentStep].description}</p>
                      </div>
                    )}
                    
                    {!completedSteps.includes(currentStep) && (
                      <div className={styles.stepCardActions}>
                        <button 
                          onClick={markStepCompleted}
                          className={styles.completeButton}
                          aria-label={`Mark step ${currentStep + 1} as complete`}
                        >
                          <div className={styles.buttonContent}>
                            <span className={styles.buttonIcon}>✓</span>
                            <span className={styles.buttonText}>Mark Complete</span>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step Navigation */}
                <div className={styles.navigationSection}>
                  <div className={styles.navigationControls}>
                    <button 
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                      className={`${styles.navButton} ${currentStep === 0 ? styles.navDisabled : ''}`}
                    >
                      <span className={styles.navIcon}>←</span>
                      <span>Previous</span>
                    </button>
                    
                    <div className={styles.stepProgress}>
                      <span className={styles.progressLabel}>
                        {currentStep + 1} of {steps.length}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                      disabled={currentStep === steps.length - 1}
                      className={`${styles.navButton} ${currentStep === steps.length - 1 ? styles.navDisabled : ''}`}
                    >
                      <span>Next</span>
                      <span className={styles.navIcon}>→</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Secondary Actions Panel */}
              <div className={styles.secondaryPanel}>
                <div className={styles.actionPanel}>
                  <h3 className={styles.panelTitle}>Quick Actions</h3>
                  
                  <div className={styles.actionGrid}>
                    <button 
                      onClick={() => setFocusMode(true)}
                      className={styles.actionButton}
                    >
                      <div className={styles.actionIcon}>🎯</div>
                      <div className={styles.actionLabel}>Focus Mode</div>
                      <div className={styles.actionDescription}>Distraction-free work</div>
                    </button>

                    <button 
                      onClick={() => setShowRecap(true)}
                      className={styles.actionButton}
                    >
                      <div className={styles.actionIcon}>📊</div>
                      <div className={styles.actionLabel}>View Progress</div>
                      <div className={styles.actionDescription}>See your achievements</div>
                    </button>

                    <button 
                      onClick={resetApp}
                      className={styles.actionButton}
                    >
                      <div className={styles.actionIcon}>🔄</div>
                      <div className={styles.actionLabel}>New Task</div>
                      <div className={styles.actionDescription}>Start over</div>
                    </button>
                  </div>

                  {undoHistory.length > 0 && (
                    <div className={styles.undoContainer}>
                      <button 
                        onClick={undoLastAction}
                        className={styles.undoButton}
                      >
                        <span className={styles.undoIcon}>↶</span>
                        <span>Undo Last Action</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlays and Modals */}
      {showMeetingSummary && (
        <MeetingSummary onClose={() => setShowMeetingSummary(false)} />
      )}

      {/* {showReadingSimplifier && (
        <ReadingSimplifier onClose={() => setShowReadingSimplifier(false)} />
      )} */}

      <CalmCompanion />

      {focusMode && (
        <FocusMode 
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepComplete={markStepCompleted}
          onExitFocus={handleExitFocus}
          onStepNavigation={handleStepNavigation}
          preferences={preferences}
        />
      )}

      {showRecap && (
        <DailyRecap 
          steps={steps}
          completedSteps={completedSteps}
          onClose={() => setShowRecap(false)}
          onReset={resetApp}
        />
      )}
    </div>
  );
}

export default App;
