import express from "express";
import { breakTaskIntoSteps, processMeetingNotes, simplifyText, generateCalmingResponse } from "../services/aiService.js";

const router = express.Router();

router.post("/task-breakdown", async (req, res) => {
  try {
    const { task } = req.body;

    if (!task) {
      return res.status(400).json({ error: "Task is required" });
    }

    const aiResponse = await breakTaskIntoSteps(task);
    res.json(JSON.parse(aiResponse));
  } catch (error) {
    res.status(500).json({
      error: "AI processing failed",
      details: error.message,
    });
  }
});

router.post("/meeting-summary", async (req, res) => {
  try {
    const { meetingContent } = req.body;

    if (!meetingContent) {
      return res.status(400).json({ error: "Meeting content is required" });
    }

    const aiResponse = await processMeetingNotes(meetingContent);
    res.json(JSON.parse(aiResponse));
  } catch (error) {
    res.status(500).json({
      error: "Meeting processing failed",
      details: error.message,
    });
  }
});

router.post("/text-simplify", async (req, res) => {
  try {
    const { text, summaryLevel = 'medium' } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text content is required" });
    }

    if (!['brief', 'medium', 'detailed'].includes(summaryLevel)) {
      return res.status(400).json({ error: "Invalid summary level. Use 'brief', 'medium', or 'detailed'" });
    }

    const aiResponse = await simplifyText(text, summaryLevel);
    res.json(JSON.parse(aiResponse));
  } catch (error) {
    res.status(500).json({
      error: "Text simplification failed",
      details: error.message,
    });
  }
});

router.post("/calm-companion", async (req, res) => {
  try {
    console.log('🛣️ Calm Companion API called with:', req.body);
    
    const { message, type = 'calming' } = req.body;

    if (!message) {
      console.log('❌ No message provided');
      return res.status(400).json({ error: "Message is required" });
    }

    console.log('📤 Calling generateCalmingResponse...');
    const aiResponse = await generateCalmingResponse(message, type);
    console.log('📥 AI Response received:', aiResponse);
    
    // Parse the JSON string response
    const parsedResponse = JSON.parse(aiResponse);
    console.log('✅ Sending response to frontend:', parsedResponse);
    
    res.json(parsedResponse);
  } catch (error) {
    console.error('❌ Calm companion error:', error);
    res.status(500).json({
      error: "Calm companion response failed",
      details: error.message,
      response: "I'm here for you. 💙 Sometimes it helps to take a deep breath and remember that feelings are temporary. What's one small thing you could do right now to care for yourself?"
    });
  }
});

export default router;
