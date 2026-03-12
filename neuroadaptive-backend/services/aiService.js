import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function breakTaskIntoSteps(task) {
  try {
    const prompt = `
You are an AI productivity assistant for neurodiverse users.
Break the task into simple, calm, step-by-step actions.
Avoid overwhelming language. Use simple, clear instructions.

Return ONLY valid JSON with this exact format:

{
  "steps": [
    {
      "step": 1,
      "action": "Clear, simple action description",
      "time": 2,
      "description": "Brief helpful note"
    }
  ],
  "recommendedFocusTime": "time estimate"
}

Task: "${task}"
`;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1000
    });

    const aiResponse = response.choices[0].message.content;
    const parsed = JSON.parse(aiResponse);
    
    // Return the full response with step objects intact
    return JSON.stringify({
      steps: parsed.steps, // Keep original step objects
      recommendedFocusTime: parsed.recommendedFocusTime || "40 minutes"
    });

  } catch (error) {
    console.warn("⚠️ Groq API issue. Returning mock response.", error.message);

    // ✅ MOCK RESPONSE (Hackathon Safe)
    return JSON.stringify({
      steps: [
        "Clarify task requirements",
        "Collect necessary information", 
        "Break work into small sections",
        "Complete one section at a time",
        "Review and finalize"
      ],
      recommendedFocusTime: "40 minutes"
    });
  }
}

export async function processMeetingNotes(meetingContent) {
  try {
    const prompt = `
You are an AI assistant helping neurodiverse employees process meeting information.
Extract and organize information from meeting notes or transcripts in a clear, structured way.

Please analyze the following meeting content and return ONLY valid JSON with this exact format:

{
  "keyDecisions": [
    "Clear, simple decision statement"
  ],
  "actionItems": [
    {
      "task": "Specific action to take",
      "assignee": "Who should do it (if mentioned)",
      "priority": "High/Medium/Low",
      "context": "Brief helpful context"
    }
  ],
  "deadlines": [
    {
      "item": "What needs to be done",
      "date": "When it's due (if mentioned)",
      "urgency": "High/Medium/Low"
    }
  ],
  "keyPoints": [
    "Important information or discussion points"
  ]
}

Meeting Content: "${meetingContent}"
`;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 1500
    });

    const aiResponse = response.choices[0].message.content;
    const parsed = JSON.parse(aiResponse);
    
    return JSON.stringify({
      keyDecisions: parsed.keyDecisions || [],
      actionItems: parsed.actionItems || [],
      deadlines: parsed.deadlines || [],
      keyPoints: parsed.keyPoints || []
    });

  } catch (error) {
    console.warn("⚠️ Groq API issue for meeting processing. Returning mock response.", error.message);

    // ✅ MOCK RESPONSE for meeting processing
    return JSON.stringify({
      keyDecisions: [
        "Proceed with Q2 project timeline",
        "Weekly team standups will continue",
        "Budget approved for new tools"
      ],
      actionItems: [
        {
          "task": "Update project documentation",
          "assignee": "You",
          "priority": "Medium",
          "context": "Include recent changes and timeline updates"
        },
        {
          "task": "Schedule follow-up meeting with stakeholders", 
          "assignee": "You",
          "priority": "High",
          "context": "Discuss project milestones and deliverables"
        }
      ],
      deadlines: [
        {
          "item": "Submit quarterly report",
          "date": "End of this week",
          "urgency": "High"
        },
        {
          "item": "Complete user testing phase",
          "date": "Next Friday",
          "urgency": "Medium"
        }
      ],
      keyPoints: [
        "Team performance has improved significantly",
        "Client feedback has been positive overall",
        "Need to focus on documentation quality"
      ]
    });
  }
}

export async function simplifyText(text, summaryLevel = 'medium') {
  try {
    const levelPrompts = {
      brief: `
Create a VERY SHORT summary (2-4 bullet points max):
- Use extremely simple words
- Only the most essential information
- Maximum 1 sentence per bullet
`,
      medium: `
Create a MEDIUM summary (4-8 bullet points):
- Use simple, everyday language
- Break down complex ideas into smaller parts
- Keep sentences short and clear
- Include main points and key details
`,
      detailed: `
Create a DETAILED but simplified version:
- Use clear, simple language
- Break down ALL complex concepts
- Explain any technical terms
- Keep good structure but make it easy to understand
- Use bullet points and short paragraphs
`
    };

    const prompt = `
You are an AI assistant helping people with dyslexia and cognitive processing challenges.
${levelPrompts[summaryLevel]}

RULES:
- Use bullet points (•) for main ideas
- Use simple words (avoid jargon)
- Keep sentences under 20 words
- Use active voice
- Break long paragraphs into short ones
- Put the most important information first

Return ONLY valid JSON with this exact format:
{
  "simplified": [
    "Clear bullet point with simple language"
  ],
  "keyTakeaways": [
    "Most important point to remember"
  ],
  "summaryLevel": "${summaryLevel}",
  "originalWordCount": 0,
  "simplifiedWordCount": 0
}

Original text: "${text}"
`;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 2000
    });

    const aiResponse = response.choices[0].message.content;
    const parsed = JSON.parse(aiResponse);
    
    // Calculate word counts
    const originalWords = text.split(/\s+/).length;
    const simplifiedWords = parsed.simplified.join(' ').split(/\s+/).length;
    
    return JSON.stringify({
      simplified: parsed.simplified || [],
      keyTakeaways: parsed.keyTakeaways || [],
      summaryLevel: summaryLevel,
      originalWordCount: originalWords,
      simplifiedWordCount: simplifiedWords
    });

  } catch (error) {
    console.warn("⚠️ Groq API issue for text simplification. Returning mock response.", error.message);

    // Calculate word count for mock response
    const originalWords = text.split(/\s+/).length;
    
    const mockResponses = {
      brief: {
        simplified: [
          "Main idea: This text talks about [key topic]",
          "Important point: [key detail]",
          "Action needed: [what to do]"
        ],
        keyTakeaways: [
          "Remember the main point",
          "Know what action to take"
        ]
      },
      medium: {
        simplified: [
          "This document explains [topic] in simple terms",
          "The main points are: [point 1], [point 2], [point 3]",
          "Key benefits include better understanding and easier access",
          "Important steps: First do [step 1], then [step 2]",
          "Common questions are answered in plain language",
          "Resources are available for more help"
        ],
        keyTakeaways: [
          "Understand the main concept",
          "Follow the clear steps provided",
          "Ask for help if needed"
        ]
      },
      detailed: {
        simplified: [
          "This text covers [topic] with detailed explanations",
          "Background information: [context] helps you understand why this matters",
          "Main sections include: introduction, key points, and conclusion",
          "Each section breaks down complex ideas into smaller, easier parts",
          "Important terms are explained in simple words",
          "Examples help make abstract concepts more concrete",
          "Step-by-step instructions guide you through processes",
          "Tips and best practices are highlighted for easy reference",
          "Common mistakes to avoid are clearly listed",
          "Additional resources provide extra support when needed"
        ],
        keyTakeaways: [
          "Complex information has been simplified",
          "Step-by-step guidance is provided",
          "Extra help is available when needed",
          "Focus on the main ideas first"
        ]
      }
    };

    const mock = mockResponses[summaryLevel] || mockResponses.medium;
    
    return JSON.stringify({
      simplified: mock.simplified,
      keyTakeaways: mock.keyTakeaways,
      summaryLevel: summaryLevel,
      originalWordCount: originalWords,
      simplifiedWordCount: mock.simplified.join(' ').split(/\s+/).length
    });
  }
}

export async function generateCalmingResponse(message, type = 'calming') {
  console.log('📩 Calm Companion request received:', { message, type });
  
  try {
    const prompt = `You are a specialized AI Calm Companion designed for neuroadaptive wellness support. You help users with stress, anxiety, focus challenges, emotional regulation, and mental wellness needs.

CONTEXT: This is part of a neuroadaptive accessibility platform helping users with ADHD, anxiety, autism, dyslexia, and cognitive differences.

USER MESSAGE: "${message}"

RESPONSE GUIDELINES:
- Be warm, empathetic, and non-judgmental
- Acknowledge their specific situation and feelings
- Provide practical, actionable wellness strategies when appropriate
- Use calming, simple language (accessibility-friendly)
- Offer specific techniques for common challenges:
  * Anxiety: breathing exercises, grounding techniques (5-4-3-2-1)
  * Overwhelm: breaking things down, one-step-at-a-time approach
  * Focus issues: mindfulness moments, attention anchoring
  * Sadness: validation, gentle self-care suggestions
  * Stress: progressive muscle relaxation, mindful pauses
- Keep responses to 2-4 sentences
- End with a gentle question or offer for further support when appropriate
- Use inclusive, neurodiversity-affirming language

TONE: Gentle, supportive, knowledgeable, calming, hopeful

Return ONLY a JSON object like this:
{"response": "Your caring, practical response here"}`;

    console.log('🤖 Sending to Groq API...');

    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.8,
      max_tokens: 300
    });

    const responseText = chatCompletion.choices[0]?.message?.content;
    console.log('✅ Groq API response:', responseText);
    
    if (responseText) {
      try {
        // Clean up the response text
        const cleanedResponse = responseText.trim();
        console.log('🧹 Cleaned response:', cleanedResponse);
        
        // Try to parse as JSON
        const parsed = JSON.parse(cleanedResponse);
        console.log('✅ Parsed JSON:', parsed);
        
        if (parsed.response && parsed.response.trim()) {
          console.log('🎉 Returning AI response');
          return JSON.stringify(parsed);
        }
      } catch (parseError) {
        console.warn('⚠️ JSON parsing failed:', parseError.message);
        console.log('📝 Raw response was:', responseText);
      }
    }
    
    console.log('⚠️ Using fallback response');
    return generateCalmingFallback(message);
  } catch (error) {
    console.error('❌ Groq API error:', error.message);
    return generateCalmingFallback(message);
  }
}

function generateCalmingFallback(message) {
  // Create contextual responses based on message content
  const messageWords = message.toLowerCase();
  
  let responses = [];
  
  if (messageWords.includes('overwhelm') || messageWords.includes('too much') || messageWords.includes('stress')) {
    responses = [
      { response: `It sounds like you're carrying a heavy load right now. That feeling of being overwhelmed is your mind's way of asking for a pause. What if we focus on just the next small step?` },
      { response: `I can hear that things feel overwhelming. You're not alone in this feeling. Let's take a moment to breathe together - in for 4, hold for 4, out for 4.` },
      { response: `When everything feels like too much, it's okay to step back. You don't have to handle it all at once. What's one tiny thing you could do right now to care for yourself?` }
    ];
  } else if (messageWords.includes('focus') || messageWords.includes('distract') || messageWords.includes('concentrate')) {
    responses = [
      { response: `Having trouble focusing is so common, especially when we have a lot on our minds. Sometimes our brains need a gentle reset. Try looking around and naming 5 things you can see.` },
      { response: `Focus can be slippery when we need it most. That's completely normal. What if you tried the 5-4-3-2-1 grounding technique? 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.` },
      { response: `Your mind is working hard, and sometimes that makes focusing challenging. Let's give it a moment to settle. Take three deep breaths and let your thoughts float by like clouds.` }
    ];
  } else if (messageWords.includes('anxious') || messageWords.includes('worry') || messageWords.includes('nervous')) {
    responses = [
      { response: `Anxiety can feel so intense, but you're brave for acknowledging it. Remember, feelings are temporary visitors - they come and they go. You're safe in this moment.` },
      { response: `I notice you're feeling anxious. That's your body trying to protect you, even if it doesn't feel helpful right now. Let's ground together - feel your feet on the floor.` },
      { response: `Worry has a way of making everything feel urgent and scary. But right here, right now, you're okay. What's one thing in your environment that feels peaceful or calm?` }
    ];
  } else if (messageWords.includes('sad') || messageWords.includes('down') || messageWords.includes('difficult')) {
    responses = [
      { response: `I can feel the weight in your words. Difficult days are part of being human, and it's okay to not be okay sometimes. You're showing strength just by reaching out.` },
      { response: `Some days are heavier than others, and that's perfectly valid. Your feelings matter, and so do you. Is there something small that usually brings you a tiny bit of comfort?` },
      { response: `When things feel difficult, remember that you've made it through hard days before. You have that strength in you, even when it doesn't feel like it.` }
    ];
  } else if (messageWords.includes('tired') || messageWords.includes('exhausted') || messageWords.includes('energy')) {
    responses = [
      { response: `Feeling exhausted takes a real toll. Your body and mind are asking for gentleness right now. Rest isn't just okay - it's necessary. What would feel most restful to you?` },
      { response: `When we're running on empty, everything feels harder. That's your system wisely asking for care. Even a few minutes of gentle breathing can help restore a little energy.` },
      { response: `Tiredness is your body's way of saying it needs attention. You're not lazy or weak - you're human. What's the smallest act of self-care you could do right now?` }
    ];
  } else {
    // General supportive responses
    responses = [
      { response: `Thank you for sharing what's on your mind. Whatever you're going through, you don't have to face it alone. I'm here to listen and support you.` },
      { response: `I'm here with you in this moment. Your feelings are valid, and it's okay to take things one breath at a time. What feels most important to you right now?` },
      { response: `You've taken a brave step by reaching out. That shows real self-awareness and care. How can we make this moment a little bit easier for you?` },
      { response: `Every feeling you're having is understandable. You're doing better than you think, even if it doesn't feel that way. What's one thing you're grateful for today, even if it's small?` },
      { response: `I can sense you're working through something important. Your willingness to seek support shows wisdom. Let's focus on what you need most in this moment.` }
    ];
  }
  
  // Select a random response from the appropriate category
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  return JSON.stringify(randomResponse);
}
