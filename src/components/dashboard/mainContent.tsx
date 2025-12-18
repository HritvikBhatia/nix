import pdfToText from "react-pdftotext";
import { useState } from "react";
import { FaFile, FaSpinner, FaUpload } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addUser } from "@/store/resumeSlice";
import ai from "@/lib/gemini";

function MainContent() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return;
    setLoading(true);

    pdfToText(file)
    .then((text) => {
      main(text);
    })
    .catch(() => {
      console.error("Failed to extract text from pdf")
      setLoading(false);
    });
  };

  // const interview = useSelector((state : any  ) => state.currentStatus)
  // console.log(interview)

  async function main(text: string) {
    try{
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt+text,
      });
      if (!response || !response.text) {
        throw new Error("Gemini returned no text");
      }
      if(response){
        setLoading(false);
      }
      console.log(response.text)
      const parsed = JSON.parse(response.text);
      dispatch(addUser(parsed));
    }catch (err){
      console.error("Gemini error", err);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 bg-lavender-grape flex flex-col items-center justify-center">
      <FaUpload className="w-8 h-8 font-bold text-blue-100 mb-3" />
      <h2 className="text-2xl font-bold text-blue-100 mb-2">
        Welcome to Nix AI Interview
      </h2>
      <p className="text-blue-100 mb-2">
        Upload your resume to get started with the AI-powered technical
        interview
      </p>

      <div className="text-gray-800 flex flex-col justify-center items-center bg-green-teal pt-5 pb-3 rounded-xl border border-green-700 cursor-pointer hover:bg-green-700 hover:border-green-500 relative w-40">
        {loading ? (
          <p className="flex items-center mb-2">
            <FaSpinner className="mb-2" /> Uploading…
          </p>
        ) : (
          <div className="flex items-center mb-2">
            <FaFile className="mr-1" /> Upload resume
          </div>
        )}

        <input
          type="file"
          onChange={handleFile}
          accept="application/pdf"
          className="opacity-0 absolute inset-0 cursor-pointer"
        />
      </div>
        <p>supports: PDF</p>
        <div></div>
    </div>
  );
}


const prompt = `You are a resume parser.

Input: Raw extracted text from a document.

Task:
1. Decide whether the text is a resume or not.
2. If it is NOT a resume:
   - Set "isResume" to "notResume"
   - Set all other fields to null
3. If it IS a resume:
   - Set "isResume" to "resume"
   - Extract the information and fill the fields below
4. Return ONLY valid JSON.
5. Do NOT add explanations or extra text.
6. Return only valid JSON, no markdown, no backticks, no explanation

JSON format (must match exactly):

{
  "name": string | null,
  "email": string | null,
  "about": string | null,
  "skills": string | null,
  "experience": string | null,
  "projects": string | null,
  "education": string | null,
  "isResume": "resume" | "notResume"
}

Resume Text:
<<<PASTE EXTRACTED TEXT HERE>>>
`

export default MainContent; 