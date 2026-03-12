import React, { useState } from 'react';
import styles from './AccessibilitySettings.module.css';
import Button from '../Button/Button';

const AccessibilitySettings = ({ preferences, updatePreference, onClose }) => {
  const [activeTab, setActiveTab] = useState('motion');

  const tabs = [
    { id: 'motion', label: '🎬 Motion', icon: '🎬' },
    { id: 'visual', label: '🎨 Visual', icon: '🎨' },
    { id: 'font', label: '📝 Text', icon: '📝' },
    { id: 'sound', label: '🔊 Sound', icon: '🔊' },
    { id: 'cognitive', label: '🧠 Cognitive', icon: '🧠' },
    { id: 'focus', label: '🎯 Focus', icon: '🎯' }
  ];

  const handleColorChange = (type, color) => {
    updatePreference(type, color);
  };

  const testSound = (soundType) => {
    const soundMap = {
      gentle: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2',
      chime: 'data:audio/wav;base64,UklGRlgCAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YTQCAACAgICA'
    };
    
    const audio = new Audio(soundMap[soundType]);
    audio.volume = preferences.soundVolume;
    audio.play().catch(() => {});
  };

  const resetToDefaults = () => {
    const defaultPrefs = {
      // Basic accessibility
      highContrast: false,
      reducedMotion: false,
      largerText: false,
      simplifiedView: true,
      autoFocus: true,
      
      // Granular motion controls
      disableTransitions: false,
      disableAnimations: false,
      disableHoverEffects: false,
      disableParallax: false,
      reduceBlinking: false,
      
      // Color customization
      colorTheme: 'default',
      customPrimaryColor: null,
      customBackgroundColor: null,
      darkMode: false,
      
      // Font options
      fontFamily: 'default',
      fontSize: 'medium',
      letterSpacing: 'normal',
      lineHeight: 'normal',
      
      // Sound controls
      soundEnabled: false,
      soundVolume: 0.5,
      successSoundType: 'gentle',
      notificationSounds: true,
      
      // Cognitive load reduction
      simpleMode: false,
      showTimeEstimates: true,
      showProgressIndicators: true,
      progressiveDisclosure: true,
      hideAdvancedFeatures: false,
      showStepNumbers: true,
      groupSimilarSteps: false,
      
      // Focus and attention
      focusIndicators: true,
      highlightCurrentStep: true,
      dimCompletedSteps: true,
      showOnlyCurrentStep: false
    };

    Object.keys(defaultPrefs).forEach(key => {
      updatePreference(key, defaultPrefs[key]);
    });
  };

  const renderMotionTab = () => (
    <div className={styles.tabContent}>
      <h3>Motion & Animation Controls</h3>
      <p className={styles.description}>
        Customize how elements move and animate to reduce sensory overload
      </p>
      
      <div className={styles.settingsGrid}>
        <label className={styles.setting}>
          <input
            type="checkbox"
            checked={preferences.reducedMotion}
            onChange={(e) => updatePreference('reducedMotion', e.target.checked)}
          />
          <span className={styles.settingLabel}>
            <strong>Reduce all motion</strong>
            <small>Disables all transitions and animations</small>
          </span>
        </label>

        <label className={styles.setting}>
          <input
            type="checkbox"
            checked={preferences.disableTransitions}
            onChange={(e) => updatePreference('disableTransitions', e.target.checked)}
          />
          <span className={styles.settingLabel}>
            <strong>Disable transitions</strong>
            <small>Remove smooth transitions between states</small>
          </span>
        </label>

        <label className={styles.setting}>
          <input
            type="checkbox"
            checked={preferences.disableAnimations}
            onChange={(e) => updatePreference('disableAnimations', e.target.checked)}
          />
          <span className={styles.settingLabel}>
            <strong>Disable animations</strong>
            <small>Stop loading spinners and moving elements</small>
          </span>
        </label>

        <label className={styles.setting}>
          <input
            type="checkbox"
            checked={preferences.disableHoverEffects}
            onChange={(e) => updatePreference('disableHoverEffects', e.target.checked)}
          />
          <span className={styles.settingLabel}>
            <strong>Disable hover effects</strong>
            <small>Remove button and link hover animations</small>
          </span>
        </label>

        <label className={styles.setting}>
          <input
            type="checkbox"
            checked={preferences.reduceBlinking}
            onChange={(e) => updatePreference('reduceBlinking', e.target.checked)}
          />
          <span className={styles.settingLabel}>
            <strong>Reduce blinking</strong>
            <small>Minimize flashing and blinking elements</small>
          </span>
        </label>
      </div>
    </div>
  );

  const renderVisualTab = () => (
    <div className={styles.tabContent}>
      <h3>Colors & Visual Theme</h3>
      <p className={styles.description}>
        Adjust colors and themes to match your visual preferences
      </p>
      
      <div className={styles.settingsGrid}>
        <div className={styles.setting}>
          <label className={styles.settingLabel}>
            <strong>Color Theme</strong>
            <small>Choose a predefined color scheme</small>
          </label>
          <select 
            value={preferences.colorTheme} 
            onChange={(e) => updatePreference('colorTheme', e.target.value)}
            className={styles.select}
          >
            <option value="default">Default</option>
            <option value="warm">Warm tones</option>
            <option value="cool">Cool tones</option>
            <option value="monochrome">Monochrome</option>
            <option value="high-contrast">High contrast</option>
          </select>
        </div>

        <label className={styles.setting}>
          <input
            type="checkbox"
            checked={preferences.darkMode}
            onChange={(e) => updatePreference('darkMode', e.target.checked)}
          />
          <span className={styles.settingLabel}>
            <strong>Dark mode</strong>
            <small>Use dark background with light text</small>
          </span>
        </label>

        <label className={styles.setting}>
          <input
            type="checkbox"
            checked={preferences.highContrast}
            onChange={(e) => updatePreference('highContrast', e.target.checked)}
          />
          <span className={styles.settingLabel}>
            <strong>High contrast mode</strong>
            <small>Increase contrast for better visibility</small>
          </span>
        </label>

        <div className={styles.colorPickers}>
          <div className={styles.colorPicker}>
            <label>Custom primary color</label>
            <input
              type="color"
              value={preferences.customPrimaryColor || '#6366f1'}
              onChange={(e) => handleColorChange('customPrimaryColor', e.target.value)}
            />
            <button 
              onClick={() => handleColorChange('customPrimaryColor', null)}
              className={styles.resetColorBtn}
            >
              Reset
            </button>
          </div>

          <div className={styles.colorPicker}>
            <label>Custom background</label>
            <input
              type="color"
              value={preferences.customBackgroundColor || '#ffffff'}
              onChange={(e) => handleColorChange('customBackgroundColor', e.target.value)}
            />
            <button 
              onClick={() => handleColorChange('customBackgroundColor', null)}
              className={styles.resetColorBtn}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFontTab = () => (
    <div className={styles.tabContent}>
      <h3>Text & Typography</h3>
      <p className={styles.description}>
        Customize text appearance for better readability
      </p>
      
      <div className={styles.settingsGrid}>
        <div className={styles.setting}>
          <label className={styles.settingLabel}>
            <strong>Font Family</strong>
            <small>Choose a font that's easier for you to read</small>
          </label>
          <select 
            value={preferences.fontFamily} 
            onChange={(e) => updatePreference('fontFamily', e.target.value)}
            className={styles.select}
          >
            <option value="default">Default (Inter)</option>
            <option value="dyslexia-friendly">Dyslexia-friendly</option>
            <option value="serif">Serif (Times)</option>
            <option value="mono">Monospace</option>
          </select>
        </div>

        <div className={styles.setting}>
          <label className={styles.settingLabel}>
            <strong>Font Size</strong>
            <small>Make text larger or smaller</small>
          </label>
          <select 
            value={preferences.fontSize} 
            onChange={(e) => updatePreference('fontSize', e.target.value)}
            className={styles.select}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="extra-large">Extra Large</option>
          </select>
        </div>

        <div className={styles.setting}>
          <label className={styles.settingLabel}>
            <strong>Letter Spacing</strong>
            <small>Adjust space between letters</small>
          </label>
          <select 
            value={preferences.letterSpacing} 
            onChange={(e) => updatePreference('letterSpacing', e.target.value)}
            className={styles.select}
          >
            <option value="tight">Tight</option>
            <option value="normal">Normal</option>
            <option value="wide">Wide</option>
          </select>
        </div>

        <div className={styles.setting}>
          <label className={styles.settingLabel}>
            <strong>Line Height</strong>
            <small>Adjust space between lines</small>
          </label>
          <select 
            value={preferences.lineHeight} 
            onChange={(e) => updatePreference('lineHeight', e.target.value)}
            className={styles.select}
          >
            <option value="compact">Compact</option>
            <option value="normal">Normal</option>
            <option value="relaxed">Relaxed</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSoundTab = () => (
    <div className={styles.tabContent}>
      <h3>Sound & Audio Feedback</h3>
      <p className={styles.description}>
        Configure audio cues and feedback sounds
      </p>
      
      <div className={styles.settingsGrid}>
        <label className={styles.setting}>
          <input
            type="checkbox"
            checked={preferences.soundEnabled}
            onChange={(e) => updatePreference('soundEnabled', e.target.checked)}
          />
          <span className={styles.settingLabel}>
            <strong>Enable sounds</strong>
            <small>Play audio feedback for actions</small>
          </span>
        </label>

        {preferences.soundEnabled && (
          <>
            <div className={styles.setting}>
              <label className={styles.settingLabel}>
                <strong>Volume Level</strong>
                <small>Adjust the volume of feedback sounds</small>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={preferences.soundVolume}
                onChange={(e) => updatePreference('soundVolume', parseFloat(e.target.value))}
                className={styles.slider}
              />
              <span className={styles.volumeLabel}>{Math.round(preferences.soundVolume * 100)}%</span>
            </div>

            <div className={styles.setting}>
              <label className={styles.settingLabel}>
                <strong>Success Sound</strong>
                <small>Sound played when completing tasks</small>
              </label>
              <div className={styles.soundButtons}>
                {['gentle', 'chime', 'none'].map((sound) => (
                  <button
                    key={sound}
                    className={`${styles.soundBtn} ${preferences.successSoundType === sound ? styles.active : ''}`}
                    onClick={() => {
                      updatePreference('successSoundType', sound);
                      if (sound !== 'none') testSound(sound);
                    }}
                  >
                    {sound === 'none' ? '🔇' : sound === 'gentle' ? '🔔' : '🎵'} 
                    {sound.charAt(0).toUpperCase() + sound.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <label className={styles.setting}>
              <input
                type="checkbox"
                checked={preferences.notificationSounds}
                onChange={(e) => updatePreference('notificationSounds', e.target.checked)}
              />
              <span className={styles.settingLabel}>
                <strong>Notification sounds</strong>
                <small>Play sounds for app notifications</small>
              </span>
            </label>
          </>
        )}
      </div>
    </div>
  );

  const renderCognitiveTab = () => (
    <div className={styles.tabContent}>
      <h3>Cognitive Load Reduction</h3>
      <p className={styles.description}>
        Simplify the interface to reduce mental fatigue
      </p>
      
      <div className={styles.settingsGrid}>
        <label className={styles.setting}>
          <input
            type="checkbox"
            checked={preferences.simpleMode}
            onChange={(e) => updatePreference('simpleMode', e.target.checked)}
          />
          <span className={styles.settingLabel}>
            <strong>Simple Mode</strong>
            <small>Hide advanced features and minimize clutter</small>
          </span>
        </label>

        <label className={styles.setting}>
          <input
            type="checkbox"
            checked={preferences.showTimeEstimates}
            onChange={(e) => updatePreference('showTimeEstimates', e.target.checked)}
          />
          <span className={styles.settingLabel}>
            <strong>Show time estimates</strong>
            <small>Display estimated time for each step</small>
          </span>
        </label>

        <label className={styles.setting}>
          <input
            type="checkbox"
            checked={preferences.showProgressIndicators}
            onChange={(e) => updatePreference('showProgressIndicators', e.target.checked)}
          />
          <span className={styles.settingLabel}>
            <strong>Show progress indicators</strong>
            <small>Visual bars and circles showing completion</small>
          </span>
        </label>

        <label className={styles.setting}>
          <input
            type="checkbox"
            checked={preferences.progressiveDisclosure}
            onChange={(e) => updatePreference('progressiveDisclosure', e.target.checked)}
          />
          <span className={styles.settingLabel}>
            <strong>Progressive disclosure</strong>
            <small>Reveal information gradually as needed</small>
          </span>
        </label>

        <label className={styles.setting}>
          <input
            type="checkbox"
            checked={preferences.showStepNumbers}
            onChange={(e) => updatePreference('showStepNumbers', e.target.checked)}
          />
          <span className={styles.settingLabel}>
            <strong>Show step numbers</strong>
            <small>Number each step for easy reference</small>
          </span>
        </label>

        <label className={styles.setting}>
          <input
            type="checkbox"
            checked={preferences.groupSimilarSteps}
            onChange={(e) => updatePreference('groupSimilarSteps', e.target.checked)}
          />
          <span className={styles.settingLabel}>
            <strong>Group similar steps</strong>
            <small>Organize related tasks together</small>
          </span>
        </label>
      </div>
    </div>
  );

  const renderFocusTab = () => (
    <div className={styles.tabContent}>
      <h3>Focus & Attention</h3>
      <p className={styles.description}>
        Customize how the app highlights important information
      </p>
      
      <div className={styles.settingsGrid}>
        <label className={styles.setting}>
          <input
            type="checkbox"
            checked={preferences.focusIndicators}
            onChange={(e) => updatePreference('focusIndicators', e.target.checked)}
          />
          <span className={styles.settingLabel}>
            <strong>Focus indicators</strong>
            <small>Highlight the current focus area</small>
          </span>
        </label>

        <label className={styles.setting}>
          <input
            type="checkbox"
            checked={preferences.highlightCurrentStep}
            onChange={(e) => updatePreference('highlightCurrentStep', e.target.checked)}
          />
          <span className={styles.settingLabel}>
            <strong>Highlight current step</strong>
            <small>Make the active step more prominent</small>
          </span>
        </label>

        <label className={styles.setting}>
          <input
            type="checkbox"
            checked={preferences.dimCompletedSteps}
            onChange={(e) => updatePreference('dimCompletedSteps', e.target.checked)}
          />
          <span className={styles.settingLabel}>
            <strong>Dim completed steps</strong>
            <small>Fade finished tasks to reduce distraction</small>
          </span>
        </label>

        <label className={styles.setting}>
          <input
            type="checkbox"
            checked={preferences.showOnlyCurrentStep}
            onChange={(e) => updatePreference('showOnlyCurrentStep', e.target.checked)}
          />
          <span className={styles.settingLabel}>
            <strong>Show only current step</strong>
            <small>Hide other steps for maximum focus</small>
          </span>
        </label>

        <label className={styles.setting}>
          <input
            type="checkbox"
            checked={preferences.autoFocus}
            onChange={(e) => updatePreference('autoFocus', e.target.checked)}
          />
          <span className={styles.settingLabel}>
            <strong>Auto-focus inputs</strong>
            <small>Automatically focus form fields</small>
          </span>
        </label>
      </div>
    </div>
  );

  return (
    <div className={`${styles.overlay} ${preferences.simpleMode ? styles.simpleMode : ''}`}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2>🛠️ Accessibility Settings</h2>
          <p>Customize your experience for comfort and productivity</p>
          <button className={styles.closeBtn} onClick={onClose}>
            <span>×</span>
          </button>
        </header>

        <nav className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              {!preferences.simpleMode && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>

        <main className={styles.content}>
          {activeTab === 'motion' && renderMotionTab()}
          {activeTab === 'visual' && renderVisualTab()}
          {activeTab === 'font' && renderFontTab()}
          {activeTab === 'sound' && renderSoundTab()}
          {activeTab === 'cognitive' && renderCognitiveTab()}
          {activeTab === 'focus' && renderFocusTab()}
        </main>

        <footer className={styles.footer}>
          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          <Button variant="primary" onClick={onClose}>
            Apply Settings
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default AccessibilitySettings;