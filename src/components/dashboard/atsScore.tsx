import type { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ai from "@/lib/gemini";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { addAts, clearAts } from "@/store/atsSlice";

export const AtsScore = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.resume.user);
  const ats = useSelector((state: RootState) => state.ats);
  const navigate = useNavigate();

  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  async function main(prompt: string) {
    setLoading(true);
    const toastId = toast.loading("Evaluating resume...");
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      if (!response || !response.text) {
        throw new Error("Gemini returned no text");
      }
      const text = response.text.trim();
      const cleanJson = text
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();
      const parsed = JSON.parse(cleanJson);
      dispatch(addAts(parsed));
      toast.success("Interview ready!", { id: toastId });
    } catch (err: any) {
      console.error("Gemini error", err);
      if (err.status === "RESOURCE_EXHAUSTED" || err.message?.includes("429")) {
        toast.error("Rate limit reached. Please wait 30 seconds.", {
          id: toastId,
        }); //
      } else if (err.status === "NOT_FOUND" || err.message?.includes("404")) {
        toast.error("AI Model error. Please try again later.", { id: toastId }); //
      } else {
        toast.error("Something went wrong. Please refresh.", { id: toastId }); //
      }
    } finally {
      setLoading(false);
    }
  }

  const handleAts = () => {
    const prompt =
      atsPrompt + JSON.stringify(user) + `\nJob Categories:\n${job}`;
    main(prompt);
  };

  const handleRetakeATS = () => {
    dispatch(clearAts());
    navigate("/atsscore");
  }

  return (
    <div className="flex-1 bg-lavender-grape p-8 flex flex-col items-center justify-center">
      {ats.currentState === "not Started" && (
        <div>
          <h2 className="text-2xl mb-6">
            Applying for jobs in which categories
          </h2>
          <input
            type="text"
            value={job}
            onChange={(e) => setJob(e.target.value)}
            className="min-w-2xl border p-2 rounded mb-3"
            placeholder="eg:- web-development, frontend, backend, full-Stack, devops "
          />
          <Button size="lg" onClick={handleAts} disabled={loading}>
            {loading ? "Evaluating Resume..." : "Review Resume"}
          </Button>
        </div>
      )}
      {ats.currentState === "Finished" && ats.ats && (
        <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-semibold mb-6 text-center">
            ATS Resume Evaluation
          </h2>

          {/* Score */}
          <div className="flex justify-center mb-6">
            <div className="flex flex-col items-center">
              <span className="text-6xl font-bold text-lavender-grape">
                {ats.ats.atsScore}
              </span>
              <span className="text-sm text-gray-500">ATS Score</span>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Summary</h3>
            <p className="text-gray-700 leading-relaxed">{ats.ats.summary}</p>
          </div>

          {/* Improvements */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">
              Recommended Improvements
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {ats.ats.improvements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate("/")}>Home</Button>
          <Button onClick={handleRetakeATS} variant="secondary">Retake ATS (Keep Resume)</Button>
          </div>
        </div>
      )}
    </div>
  );
};

const atsPrompt = `
You are an ATS (Applicant Tracking System) evaluator.

Input:
1. Candidate resume data in JSON format.
2. Job categories the candidate is applying for.

Task:
- Analyze the resume against typical ATS criteria for the given job categories.
- Score the resume based on keyword relevance, skills match, experience clarity, and structure.

Rules:
- Return ONLY valid JSON.
- Do NOT add explanations, markdown, backticks, or extra text.
- All fields must exist.
- If information is missing, make reasonable ATS assumptions.

JSON format (must match exactly):

{
  "atsScore": number,        // value between 0 and 100
  "summary": string,         // short ATS-style evaluation summary
  "improvements": string[]  // clear, actionable improvement points
}

Candidate Resume JSON:
`;
