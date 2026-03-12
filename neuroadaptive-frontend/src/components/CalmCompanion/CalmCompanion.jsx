import React, { useState, useRef, useEffect } from 'react';
import styles from './CalmCompanion.module.css';

const CalmCompanion = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'ai', 
      text: "Hi! This is your friend, Elio. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  const quickActions = [
    { emoji: "😰", text: "I'm feeling overwhelmed" },
    { emoji: "🎯", text: "Help me focus" }, 
    { emoji: "🫁", text: "I need a breathing exercise" },
    { emoji: "💙", text: "I'm having a difficult day" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setTimeout(() => handleSendMessage(transcript), 100);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleVoiceInput = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        setIsListening(true);
        recognitionRef.current.start();
      }
    }
  };

  const addMessage = (text, type) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      type,
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const simulateTyping = async () => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    setIsTyping(false);
  };

  const speakMessage = (text) => {
    if (isVoiceMode && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      // Use a gentle voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Female') || voice.name.includes('Woman')
      ) || voices[0];
      
      if (preferredVoice) utterance.voice = preferredVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (messageText = inputText) => {
    const textToSend = messageText.trim();
    if (!textToSend) return;

    // Add user message
    addMessage(textToSend, 'user');
    setInputText('');
    setIsLoading(true);

    // Simulate AI thinking time
    await simulateTyping();

    try {
      console.log('🚀 Sending message to API:', textToSend);
      
      const response = await fetch('http://localhost:3000/api/ai/calm-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('📥 API response:', result);
        
        // The API already returns a parsed object, no need to parse again
        const aiResponseText = result.response;
        console.log('✅ AI message:', aiResponseText);
        
        const aiMessage = addMessage(aiResponseText, 'ai');
        speakMessage(aiResponseText);
      } else {
        console.error('❌ API response not ok:', response.status);
        throw new Error('AI service unavailable');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      const fallbackText = "I'm here for you. 💙 Sometimes it helps to take a deep breath and remember that feelings are temporary. What's one small thing you could do right now to care for yourself?";
      addMessage(fallbackText, 'ai');
      speakMessage(fallbackText);
    }

    setIsLoading(false);
    // Focus back on input
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleQuickAction = (action) => {
    handleSendMessage(action.text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Floating Chat Widget */}
      <div className={`${styles.chatWidget} ${isOpen ? styles.open : ''}`}>
        {/* Chat Button (when closed) */}
        {!isOpen && (
          <div 
            className={styles.chatButton}
            onClick={() => setIsOpen(true)}
          >
            <span className={styles.chatIcon}>☺️</span>
            <span className={styles.chatLabel}>Elio</span>
          </div>
        )}

        {/* Chat Window (when open) */}
        {isOpen && (
          <div className={styles.chatWindow}>
            {/* Header */}
            <div className={styles.chatHeader}>
              <div className={styles.headerInfo}>
                <span className={styles.aiAvatar}>☺️</span>
                <div>
                  <h4>Elio</h4>
                  <span className={styles.status}>Here for you</span>
                </div>
              </div>
              
              <div className={styles.headerControls}>
                {/* <button 
                  className={`${styles.voiceToggle} ${isVoiceMode ? styles.active : ''}`}
                  onClick={() => setIsVoiceMode(!isVoiceMode)}
                  title={`Voice ${isVoiceMode ? 'on' : 'off'}`}
                >
                  {isVoiceMode ? '🔊' : '🔇'}
                </button> */}
                <button 
                  className={styles.minimizeBtn} 
                  onClick={() => setIsOpen(false)}
                  title="Minimize"
                >
                  ─
                </button>
                <button className={styles.closeBtn} onClick={() => setIsOpen(false)} title="Close">
                  ×
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className={styles.messagesArea}>
              <div className={styles.messagesContainer}>
                {messages.map((message) => (
                  <div key={message.id} className={styles.messageWrapper}>
                    <div className={`${styles.messageBubble} ${styles[message.type]}`}>
                      {message.type === 'ai' && (
                        <div className={styles.messageAvatar}>☺️</div>
                      )}
                      <div className={styles.messageContent}>
                        <p>{message.text}</p>
                        <span className={styles.messageTime}>
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className={styles.messageWrapper}>
                    <div className={`${styles.messageBubble} ${styles.ai}`}>
                      <div className={styles.messageAvatar}>🧘‍♀️</div>
                      <div className={styles.typingIndicator}>
                        <div className={styles.typingDots}>
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActionsContainer}>
              <div className={styles.quickActionsGrid}>
                {quickActions.map((action, index) => (
                  <button 
                    key={index}
                    className={styles.quickActionBtn}
                    onClick={() => handleQuickAction(action)}
                    disabled={isLoading}
                    title={action.text}
                  >
                    {action.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className={styles.inputArea}>
              <div className={styles.inputContainer}>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className={styles.messageInput}
                  disabled={isLoading}
                  maxLength={300}
                />
                
                <div className={styles.inputActions}>
                  {/* <button 
                    className={`${styles.actionBtn} ${styles.voiceBtn} ${isListening ? styles.listening : ''}`}
                    onClick={handleVoiceInput}
                    disabled={isLoading}
                    title="Voice message"
                  >
                    {isListening ? '🔴' : '🎤'}
                  </button> */}
                  
                  <button 
                    className={`${styles.actionBtn} ${styles.sendBtn}`}
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !inputText.trim()}
                    title="Send"
                  >
                    ➤
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CalmCompanion;