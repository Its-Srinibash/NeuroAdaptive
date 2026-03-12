import React from 'react';
import styles from './TaskInput.module.css';
import Button from '../Button/Button';

const TaskInput = ({ 
  task, 
  setTask, 
  onSubmit, 
  loading = false, 
  error = '' 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim() || loading) return;
    onSubmit();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="task-input" className={styles.label}>
            What would you like to accomplish?
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="task-input"
              type="text"
              placeholder="e.g., Prepare quarterly report, Organize home office, Learn React"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              disabled={loading}
              aria-describedby={error ? "task-error" : undefined}
              aria-invalid={error ? "true" : "false"}
            />
            <div className={styles.inputIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z"/>
                <path d="M12 22V12"/>
                <path d="M12 2V12"/>
                <path d="M2 7L12 12"/>
                <path d="M22 7L12 12"/>
              </svg>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          size="large" 
          fullWidth
          loading={loading}
          disabled={!task.trim() || loading}
        >
          {loading ? 'Breaking down task...' : 'Break into manageable steps'}
        </Button>

        {error && (
          <div id="task-error" className={styles.error} role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default TaskInput;