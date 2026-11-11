import { GoogleGenerativeAI } from "@google/generative-ai";
import { Session } from "../models/session.model.js";
import { Question } from "../models/question.model.js";

const ai = new GoogleGenerativeAI(process.env.GEN_AI);

export const generateInterviewQuestion = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, sessionId } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // pehle se bane questions
    const existingDocs = await Question.find({ session: sessionId }).select("question");
    const existing = existingDocs.map((q) => q.question);

    const prompt = `
You are an interview question generator.
Return ONLY a valid JSON array. Do not include explanations, extra text, or formatting.

Example format:
[
  {"question": "What is React?", "answer": "React is a JS library for building UIs."}
]

Now generate 5 questions for a ${role} with ${experience} years experience.
Focus on topics: ${topicsToFocus}.

Do NOT repeat or rephrase any of these existing questions:
${JSON.stringify(existing)}
`;

    const model = ai.getGenerativeModel({ model: "gemini-3.8-flash" });
    const result = await model.generateContent(prompt);

    let rawText = result.response.text();
    rawText = rawText.replace(/```json|```/gi, "").trim();
    const match = rawText.match(/\[[\s\S]*\]/);
    if (match) rawText = match[0];

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (err) {
      console.error("Failed to parse JSON:", rawText);
      return res.status(400).json({ message: "Invalid JSON from model" });
    }

    // duplicates hatao (case/punctuation ignore karke)
    const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
    const seen = new Set(existing.map(normalize));
    const fresh = data.filter((q) => {
      const key = normalize(q.question || "");
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (fresh.length === 0) {
      return res.status(200).json({ message: "No new unique questions generated" });
    }

    const createdQuestions = await Question.insertMany(
      fresh.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer,
      }))
    );

    session.questions.push(...createdQuestions.map((q) => q._id));
    await session.save();

    return res.status(201).json({ message: "Questions created successfully" });
  } catch (error) {
    console.error("Error in generateInterviewQuestion:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const togglePinQuestion = async(req,res)=>{
    try {
        const question = await Question.findById(req.params.id)

        if(!question){
            return res.status(401).json({
                message:"Question not found"
            })
        }

        question.isPinned = !question.isPinned

        await question.save({ validateBeforeSave: false })
        
        return res.status(201).json({
            message:"Question pinned successfully",
            // question
        })
    } catch (error) {
        console.log(`this eror is coming from toggle PIn question, error->${error}`)
    }
}