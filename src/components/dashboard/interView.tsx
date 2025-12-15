import type { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { GoogleGenAI } from "@google/genai";
import { useState } from "react";
import { startInterview } from "@/store/interviewSlice";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

export const InterView = () => {
  const diapatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.resume.user);
  const interview = useSelector((state: RootState) => state.interview);

  const naviagte = useNavigate();

  if (!user) {
    naviagte("/", { replace: true });
  }

  async function main() {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt + "\n\nCandidate Profile:\n" + JSON.stringify(user),
      });
      if (!response || !response.text) {
        throw new Error("Gemini returned no text");
      }
      if (response) {
        setLoading(false);
      }
      console.log(response.text);
      const parsed = JSON.parse(response.text);
      diapatch(
        startInterview({
          questions: parsed.questions,
          correctAnswer: parsed.correctAnswer,
          weightage: parsed.weightage,
        })
      );
    } catch (err) {
      console.error("Gemini error", err);
    } finally {
      setLoading(false);
    }
  }

  function handleStart() {
    setLoading(true);
    main();
  }

  return (
    <div className="flex-1 bg-lavender-grape flex items-center justify-center">
      {interview.currentStatus == "not started" && (
        <div>
          <h1>{user?.name} Lets Start the Interview</h1>
          <Button size="lg" onClick={handleStart}>
            {loading ? "loading.." : "start"}
          </Button>
        </div>
      )}
      {interview.currentStatus == "running" && (
        <div>
                
        </div>
      )}
    </div>
  );
};
const prompt = `
You are an AI technical interviewer.

Task:
Generate a structured technical interview using the candidate profile.

Rules:
1. Generate exactly 10 interview questions.
2. Split difficulty as:
   - 4 Easy questions (2 marks each)
   - 4 Medium questions (3 marks each)
   - 2 Hard questions (5 marks each)
3. Total marks MUST equal exactly 30.
4. Each question must have ONE correct answer.
5. Questions must progress from easy → hard.
6. Focus on real-world, practical understanding.
7. Do NOT include explanations, markdown, backticks, or extra text.
8. Return only valid JSON, no markdown, no backticks, no explanation

Output format (JSON ONLY):
{
  "questions": [
    { "id": 1, "text": "Question text", "difficulty": "easy" },
    { "id": 2, "text": "Question text", "difficulty": "easy" },
    { "id": 3, "text": "Question text", "difficulty": "medium" },
    { "id": 4, "text": "Question text", "difficulty": "hard" }
  ],
  "correctAnswer": [
    "Correct answer for question 1",
    "Correct answer for question 2"
  ],
  "weightage": [
    2,
    2,
    3,
    5
  ],
}

Important:
- Index of questions, correctAnswer, and weightage MUST match.
- Answers must be concise (1-2 sentences max).
- No missing or extra fields.
`;
