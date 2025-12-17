import type { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { GoogleGenAI } from "@google/genai";
import { useEffect, useState } from "react";
import { evaluateInterview, startInterview, submitInterview } from "@/store/interviewSlice";
import { toast } from "sonner";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

export const InterView = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form , setForm] = useState({ques1:"", ques2:"", ques3:"", ques4:"", ques5:"", ques6:"", ques7:"", ques8:"", ques9:"", ques10:"" })
  const user = useSelector((state: RootState) => state.resume.user);
  const interview = useSelector((state: RootState) => state.interview);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
    console.log(interview.currentInterview)
  }, [user, navigate]);

  async function main(prompt : string, func : string) {
    setLoading(true)
    const toastId = toast.loading(func === "generate" ? "Generating interview..." : "Evaluating answers...");
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt 
      });
      if (!response || !response.text) {
        throw new Error("Gemini returned no text");
      }
      const text = response.text.trim();
      const cleanJson = text.replace(/^```json/, "").replace(/```$/, "").trim();
      const parsed = JSON.parse(cleanJson);
      if(func === "generate"){
        dispatch(
          startInterview({
            questions: parsed.questions,
            correctAnswer: parsed.correctAnswer,
            weightage: parsed.weightage,
          })
        )
        toast.success("Interview ready!", { id: toastId });;
      } else if (func === "evaluate"){
        dispatch(
          evaluateInterview({
            interviewerScored: parsed.interviewerScored,
            aiSummary: parsed.aiSummary
          })
        )
        toast.success("Evaluation complete!", { id: toastId });
      }
      } catch (err: any) {
      console.error("Gemini error", err);
      if (err.status === "RESOURCE_EXHAUSTED" || err.message?.includes("429")) {
      toast.error("Rate limit reached. Please wait 30 seconds.", { id: toastId }); //
      } else if (err.status === "NOT_FOUND" || err.message?.includes("404")) {
        toast.error("AI Model error. Please try again later.", { id: toastId }); //
      } else {
        toast.error("Something went wrong. Please refresh.", { id: toastId }); //
      }
    } finally {
      setLoading(false);
    }
  }

  

  function handleStart() {
    setLoading(true);
    const prompt = generateQuestions + "\n\nCandidate Profile:\n" + JSON.stringify({
          education: user?.education,
          projects: user?.projects,
          skills: user?.skills,
        })
    main(prompt, "generate");
  }

  function handleSubmitTest(){
    dispatch(submitInterview(Object.values(form)));
  }

  function handleEvaluate(){
    setLoading(true);
    const prompt = evaluateAnswer + "\n\n" + JSON.stringify({
      questions: interview.currentInterview?.questions,
      answers: interview.currentInterview?.interviewerAnswer,
      weightage: interview.currentInterview?.weightage,
    });

    main(prompt, "evaluate");
  }

  return (
    <div className="flex-1 bg-lavender-grape flex items-center justify-center">
      {interview.currentStatus === "not started" && (
        <div className="max-w-3xl">
          <h1>{user?.name} Lets Start the Interview</h1>
          <Button size="lg" onClick={handleStart} disabled={loading}>
            {loading ? "loading.." : "start"}
          </Button>
        </div>
      )}
      {interview.currentStatus === "running" && (
        <div className="max-w-3xl rounded-xl p-6">
          <ol className="space-y-8 list-decimal pl-6">
            {interview.currentInterview?.questions.map((ques) => (
              <li key={ques.id}>
                <div className="space-y-3">
                  <p className="text-base font-medium text-gray-800 leading-relaxed">
                    {ques.text}
                  </p>
                  <textarea placeholder="Type your answer here..." rows={4} className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-white resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500" 
                  onInput={(e) => { 
                    const target = e.currentTarget; 
                    target.style.height = "auto"; 
                    target.style.height = target.scrollHeight + "px";
                  }}
                  name={`ques${ques.id}`}
                  value={form[`ques${ques.id}` as keyof typeof form]}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setForm((prev) => ({
                      ...prev,
                      [name]:value
                    }))
                  }}
                  />
                </div>
              </li>
            ))}
          </ol>
          <Button onClick={handleSubmitTest} variant="secondary" className="mt-2">
            Submit Test
          </Button>
        </div>
      )}
      {interview.currentStatus === "finished" && (
        <div>
          <h1 className="max-w-3xl">Congrats {user?.name} finishing the interview</h1>
          <Button size="lg" onClick={handleEvaluate} disabled={loading}>
            {loading ? "Evaluating..." : "start Evaluating"}
          </Button>
        </div>
      )}
    </div>
  );
};
const generateQuestions = `
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
  ]
}

Important:
- Index of questions, correctAnswer, and weightage MUST match.
- Answers must be concise (1-2 sentences max).
- No missing or extra fields.
`;

const evaluateAnswer = `
You are an AI technical interviewer evaluating a completed interview.

Task:
Evaluate the candidate's answers against the correct answers.

Rules:
1. There are exactly 10 questions.
2. Evaluate answers in order (index-based).
3. Each question has a fixed weight.
4. Give full marks only if the answer is correct and clear.
5. Give partial marks if the idea is partially correct.
6. Give 0 if the answer is wrong or irrelevant.
7. Scores must be integers.
8. Do NOT exceed the question's weight.
9. Total score must be out of 30.
10. Do NOT include explanations per question.

Return ONLY valid JSON.
No markdown, no backticks, no extra text.

Input format:
{
  "questions": [...],
  "answers": [...],
  "weightage": [...]
}

Output format (JSON ONLY):
{
  "interviewerScored": [number, number, number, number, number, number, number, number, number, number],
  "aiSummary": "Short 2-4 sentence summary of candidate performance, strengths, and weaknesses."
}

Important:
- Length of interviewerScored MUST be exactly 10.
- Index alignment is mandatory.
`;
