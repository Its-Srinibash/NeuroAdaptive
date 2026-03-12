import React, { useState, useCallback } from 'react';
import styles from './ReadingSimplifier.module.css';
import Button from '../Button/Button';

const ReadingSimplifier = ({ onBack, preferences }) => {
  const [inputText, setInputText] = useState('');
  const [summaryLevel, setSummaryLevel] = useState('medium');
  const [simplifiedResult, setSimplifiedResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const simplifyText = useCallback(async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to simplify.");
      return;
    }

    setLoading(true);
    setError('');
    setSimplifiedResult(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/text-simplify",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ 
            text: inputText, 
            summaryLevel: summaryLevel 
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSimplifiedResult(data);
    } catch (err) {
      console.error("Error simplifying text:", err);
      setError("Unable to simplify text. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [inputText, summaryLevel]);

  const resetSimplifier = useCallback(() => {
    setInputText('');
    setSimplifiedResult(null);
    setError('');
    setSummaryLevel('medium');
  }, []);

  const handleLevelChange = (level) => {
    setSummaryLevel(level);
    if (simplifiedResult) {
      // If we already have a result, automatically re-simplify with new level
      setSimplifiedResult(null);
      setTimeout(() => {
        simplifyText();
      }, 100);
    }
  };

  const getSampleText = () => {
    return `Dear Team,

    I hope this email finds you well. I am writing to inform you about the upcoming changes to our company's health insurance policy, which will take effect starting January 1st, 2024. These modifications have been implemented following extensive consultations with our Human Resources department, insurance providers, and employee feedback surveys conducted throughout the previous quarter.

    The primary changes include enhanced coverage for mental health services, increased annual deductibles from $500 to $750 for individual plans and from $1,000 to $1,500 for family plans, and the addition of telemedicine consultations at no additional cost to employees. Furthermore, we have expanded our network of preferred healthcare providers to include three additional medical centers in the metropolitan area, which should improve accessibility for employees residing in suburban locations.

    Please review the attached documentation carefully and attend one of the mandatory information sessions scheduled for December 15th, 16th, and 17th in the main conference room from 2:00 PM to 3:30 PM each day. If you have any questions or concerns, please do not hesitate to contact the HR department.

    Best regards,
    Management`;
  };

  const loadSampleText = () => {
    setInputText(getSampleText());
  };

  if (loading) {
    return (
      <div className={`${styles.loadingContainer} ${preferences?.highContrast ? styles.highContrast : ''}`}>
        <div className={styles.loadingContent}>
          <div className={styles.breathingCircle}></div>
          <h2>Making text easier to read...</h2>
          <p>Breaking down complex words and ideas</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${preferences?.highContrast ? styles.highContrast : ''} ${preferences?.largerText ? styles.largerText : ''}`}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={onBack} className={styles.backButton}>
            <span className={styles.backIcon}>←</span>
            <span>Back to Tasks</span>
          </button>
          
          <div className={styles.titleSection}>
            <div className={styles.simplifierIcon}>📚</div>
            <div className={styles.titleText}>
              <h1 className={styles.title}>Reading Simplifier</h1>
              <p className={styles.subtitle}>Turn complex text into easy-to-understand bullet points</p>
            </div>
          </div>
          
          <div className={styles.spacer}></div>
        </div>
      </header>

      <main className={styles.content}>
        {!simplifiedResult ? (
          /* Modern Input Section */
          <div className={styles.inputSection}>
            <div className={styles.inputCard}>
              <div className={styles.cardHeader}>
                {/* <div className={styles.cardIcon}>📚</div> */}
                <div className={styles.cardTitle}>
                  <h2>Paste Your Text Here</h2>
                  <p>Copy and paste any text - emails, documents, articles, or policies. I'll break it down into simple, easy-to-read bullet points.</p>
                </div>
              </div>

              {/* Modern Summary Level Selection */}
              <div className={styles.levelSelection}>
                <h3>Choose Summary Length:</h3>
                <div className={styles.levelButtons}>
                  <button 
                    className={`${styles.levelButton} ${summaryLevel === 'brief' ? styles.levelActive : ''}`}
                    onClick={() => setSummaryLevel('brief')}
                  >
                    <div className={styles.levelContent}>
                      <span className={styles.levelTitle}>Brief</span>
                      <span className={styles.levelDesc}>Quick overview</span>
                    </div>
                  </button>
                  <button 
                    className={`${styles.levelButton} ${summaryLevel === 'medium' ? styles.levelActive : ''}`}
                    onClick={() => setSummaryLevel('medium')}
                  >
                    <div className={styles.levelContent}>
                      <span className={styles.levelTitle}>Medium</span>
                      <span className={styles.levelDesc}>Balanced detail</span>
                    </div>
                  </button>
                  <button 
                    className={`${styles.levelButton} ${summaryLevel === 'detailed' ? styles.levelActive : ''}`}
                    onClick={() => setSummaryLevel('detailed')}
                  >
                    <div className={styles.levelContent}>
                      <span className={styles.levelTitle}>Detailed</span>
                      <span className={styles.levelDesc}>Full explanation</span>
                    </div>
                  </button>
                </div>
              </div>
              
              <div className={styles.inputWrapper}>
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your text here...&#10;&#10;Example:&#10;Long emails, policy documents, academic papers, news articles, or any text that feels overwhelming to read."
                  className={styles.textInput}
                  rows="8"
                />
                
                <div className={styles.inputActions}>
                  <button 
                    onClick={simplifyText}
                    disabled={!inputText.trim() || loading}
                    className={styles.primaryButton}
                  >
                    <span className={styles.buttonIcon}>✨</span>
                    <span>Make It Simple</span>
                  </button>
                  
                  <button 
                    onClick={loadSampleText}
                    className={styles.secondaryButton}
                  >
                    Try Sample Text
                  </button>
                  
                  {inputText && (
                    <button 
                      onClick={resetSimplifier}
                      className={styles.secondaryButton}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Word Count Indicator */}
              {inputText && (
                <div className={styles.wordCount}>
                  <span className={styles.wordCountIcon}>📊</span>
                  <span>Word count: {inputText.split(/\\s+/).length} words</span>
                </div>
              )}
              
              {error && (
                <div className={styles.errorMessage}>
                  <span className={styles.errorIcon}>⚠️</span>
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Results Section */
          <div className={styles.resultsSection}>
            {/* Stats Summary */}
            <div className={styles.statsCard}>
              <div className={styles.statsContent}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{simplifiedResult.originalWordCount}</span>
                  <span className={styles.statLabel}>Original Words</span>
                </div>
                <div className={styles.statArrow}>→</div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{simplifiedResult.simplifiedWordCount}</span>
                  <span className={styles.statLabel}>Simplified Words</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{Math.round((1 - simplifiedResult.simplifiedWordCount/simplifiedResult.originalWordCount) * 100)}%</span>
                  <span className={styles.statLabel}>Shorter</span>
                </div>
              </div>
              <div className={styles.levelIndicator}>
                <span className={styles.levelBadge}>{simplifiedResult.summaryLevel} summary</span>
              </div>
            </div>

            {/* Level Selection in Results */}
            <div className={styles.levelSelection}>
              <h3>Change Summary Length:</h3>
              <div className={styles.levelButtons}>
                <button 
                  className={`${styles.levelButton} ${summaryLevel === 'brief' ? styles.levelActive : ''}`}
                  onClick={() => handleLevelChange('brief')}
                >
                  <span className={styles.levelTitle}>Brief</span>
                  <span className={styles.levelDesc}>Quick overview</span>
                </button>
                <button 
                  className={`${styles.levelButton} ${summaryLevel === 'medium' ? styles.levelActive : ''}`}
                  onClick={() => handleLevelChange('medium')}
                >
                  <span className={styles.levelTitle}>Medium</span>
                  <span className={styles.levelDesc}>Balanced detail</span>
                </button>
                <button 
                  className={`${styles.levelButton} ${summaryLevel === 'detailed' ? styles.levelActive : ''}`}
                  onClick={() => handleLevelChange('detailed')}
                >
                  <span className={styles.levelTitle}>Detailed</span>
                  <span className={styles.levelDesc}>Full explanation</span>
                </button>
              </div>
            </div>

            {/* Simplified Text */}
            <section className={styles.resultsCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>Simplified Text</h3>
                <span className={styles.cardCount}>{simplifiedResult.simplified.length} points</span>
              </div>
              
              <ul className={styles.bulletList}>
                {simplifiedResult.simplified.map((bullet, index) => (
                  <li key={index} className={styles.bulletItem}>
                    <div className={styles.bulletIcon}>•</div>
                    <span className={styles.bulletText}>{bullet}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Key Takeaways */}
            {simplifiedResult.keyTakeaways && simplifiedResult.keyTakeaways.length > 0 && (
              <section className={styles.resultsCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 11l3 3L22 4"/>
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                    </svg>
                  </div>
                  <h3 className={styles.cardTitle}>Key Takeaways</h3>
                  <span className={styles.cardCount}>{simplifiedResult.keyTakeaways.length}</span>
                </div>
                
                <ul className={styles.takeawaysList}>
                  {simplifiedResult.keyTakeaways.map((takeaway, index) => (
                    <li key={index} className={styles.takeawayItem}>
                      <div className={styles.takeawayIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 6L9 17L4 12"/>
                        </svg>
                      </div>
                      <span className={styles.takeawayText}>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <Button 
                onClick={resetSimplifier}
                variant="primary"
                size="large"
              >
                Simplify Another Text
              </Button>
              
              <Button 
                onClick={onBack}
                variant="outline"
                size="large"
              >
                Back to Main Tasks
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReadingSimplifier;