import React, { useState, useCallback } from 'react';
import styles from './MeetingSummary.module.css';
import Button from '../Button/Button';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const MeetingSummary = ({ onBack, preferences }) => {
  const [meetingContent, setMeetingContent] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const processMeeting = useCallback(async () => {
    if (!meetingContent.trim()) {
      setError("Please enter your meeting notes or transcript.");
      return;
    }

    setLoading(true);
    setError('');
    setSummary(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/meeting-summary",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ meetingContent })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSummary(data);
    } catch (err) {
      console.error("Error processing meeting:", err);
      setError("Unable to process meeting notes. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [meetingContent]);

  const resetMeeting = useCallback(() => {
    setMeetingContent('');
    setSummary(null);
    setError('');
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return styles.priorityHigh;
      case 'medium': return styles.priorityMedium;
      case 'low': return styles.priorityLow;
      default: return styles.priorityMedium;
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high': return styles.urgencyHigh;
      case 'medium': return styles.urgencyMedium;
      case 'low': return styles.urgencyLow;
      default: return styles.urgencyMedium;
    }
  };

  if (loading) {
    return (
      <div className={`${styles.loadingContainer} ${preferences?.highContrast ? styles.highContrast : ''}`}>
        <div className={styles.loadingContent}>
          <div className={styles.breathingCircle}></div>
          <h2>Processing your meeting notes...</h2>
          <p>Extracting key decisions and action items</p>
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
            <div className={styles.meetingIcon}>📋</div>
            <div className={styles.titleText}>
              <h1 className={styles.title}>Meeting Action Items</h1>
              <p className={styles.subtitle}>Turn overwhelming meetings into clear, manageable action steps</p>
            </div>
          </div>
          
          <div className={styles.spacer}></div>
        </div>
      </header>

      <main className={styles.content}>
        {!summary ? (
          /* Simplified Input Section */
          <div className={styles.inputSection}>
            <div className={styles.inputCard}>
              <div className={styles.cardHeader}>
                {/* <div className={styles.cardIcon}>📝</div> */}
                <div className={styles.cardTitle}>
                  <h2>Paste Your Meeting Notes</h2>
                  <p>Copy and paste meeting notes, transcript, or any meeting-related text. I'll help extract the important action items and decisions.</p>
                </div>
              </div>
              
              <div className={styles.inputWrapper}>
                <textarea 
                  value={meetingContent}
                  onChange={(e) => setMeetingContent(e.target.value)}
                  placeholder={`Paste your meeting notes, transcript, or summary here...\n\nExample:\n- Discussed Q2 project timeline\n- John will update documentation by Friday\n- Need to schedule follow-up with stakeholders\n- Budget approved for new design tools`}
                  className={styles.meetingInput}
                  rows="10"
                />
              </div>
              
              <div className={styles.inputActions}>
                <button 
                  onClick={processMeeting}
                  disabled={!meetingContent.trim() || loading}
                  className={styles.primaryButton}
                >
                  <span className={styles.buttonIcon}>🎯</span>
                  <span>Extract Action Items</span>
                </button>
                
                {meetingContent && (
                  <button 
                    onClick={resetMeeting}
                    className={styles.secondaryButton}
                  >
                    Clear
                  </button>
                )}
              </div>
              
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
            {/* Key Decisions */}
            {summary.keyDecisions && summary.keyDecisions.length > 0 && (
              <section className={styles.summaryCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 11l3 3L22 4"/>
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                    </svg>
                  </div>
                  <h3 className={styles.cardTitle}>Key Decisions</h3>
                  <span className={styles.cardCount}>{summary.keyDecisions.length}</span>
                </div>
                
                <ul className={styles.itemsList}>
                  {summary.keyDecisions.map((decision, index) => (
                    <li key={index} className={styles.decisionItem}>
                      <div className={styles.itemIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 6L9 17L4 12"/>
                        </svg>
                      </div>
                      <span className={styles.itemText}>{decision}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Action Items */}
            {summary.actionItems && summary.actionItems.length > 0 && (
              <section className={styles.summaryCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <path d="M9 9h6m-6 4h6"/>
                    </svg>
                  </div>
                  <h3 className={styles.cardTitle}>Your Action Items</h3>
                  <span className={styles.cardCount}>{summary.actionItems.length}</span>
                </div>
                
                <ul className={styles.itemsList}>
                  {summary.actionItems.map((item, index) => (
                    <li key={index} className={styles.actionItem}>
                      <div className={styles.itemIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <path d="M9 9h6m-6 4h4"/>
                        </svg>
                      </div>
                      <div className={styles.actionContent}>
                        <div className={styles.actionHeader}>
                          <span className={styles.actionText}>{item.task}</span>
                          <span className={`${styles.priorityBadge} ${getPriorityColor(item.priority)}`}>
                            {item.priority || 'Medium'}
                          </span>
                        </div>
                        {item.assignee && (
                          <div className={styles.assignee}>Assigned to: {item.assignee}</div>
                        )}
                        {item.context && (
                          <div className={styles.context}>{item.context}</div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Deadlines */}
            {summary.deadlines && summary.deadlines.length > 0 && (
              <section className={styles.summaryCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                  </div>
                  <h3 className={styles.cardTitle}>Important Deadlines</h3>
                  <span className={styles.cardCount}>{summary.deadlines.length}</span>
                </div>
                
                <ul className={styles.itemsList}>
                  {summary.deadlines.map((deadline, index) => (
                    <li key={index} className={styles.deadlineItem}>
                      <div className={styles.itemIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12,6 12,12 16,14"/>
                        </svg>
                      </div>
                      <div className={styles.deadlineContent}>
                        <div className={styles.deadlineHeader}>
                          <span className={styles.deadlineText}>{deadline.item}</span>
                          <span className={`${styles.urgencyBadge} ${getUrgencyColor(deadline.urgency)}`}>
                            {deadline.urgency || 'Medium'}
                          </span>
                        </div>
                        {deadline.date && (
                          <div className={styles.deadlineDate}>Due: {deadline.date}</div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Key Points */}
            {summary.keyPoints && summary.keyPoints.length > 0 && (
              <section className={styles.summaryCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6h.01M12 10v4"/>
                    </svg>
                  </div>
                  <h3 className={styles.cardTitle}>Key Discussion Points</h3>
                  <span className={styles.cardCount}>{summary.keyPoints.length}</span>
                </div>
                
                <ul className={styles.itemsList}>
                  {summary.keyPoints.map((point, index) => (
                    <li key={index} className={styles.pointItem}>
                      <div className={styles.itemIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="2"/>
                        </svg>
                      </div>
                      <span className={styles.itemText}>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Simplified Action Buttons */}
            <div className={styles.actionButtons}>
              <button 
                onClick={resetMeeting}
                className={styles.primaryButton}
              >
                <span className={styles.buttonIcon}>🔄</span>
                <span>Process Another Meeting</span>
              </button>
              
              <button 
                onClick={onBack}
                className={styles.secondaryButton}
              >
                Back to Main Tasks
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MeetingSummary;