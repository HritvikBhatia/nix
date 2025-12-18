import type { RootState } from "@/store/store";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp, CheckCircle, XCircle } from "lucide-react"; // Import icons
import "react-circular-progressbar/dist/styles.css";
import { resetInterview, startInterview } from "@/store/interviewSlice";

function Evaluation() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.resume.user);
  const interview = useSelector((state: RootState) => state.interview);

  const [expandedId, setExpandedId] = useState<number | null>(null);

  const totalScore = useMemo(() => {
    return interview.currentInterview?.interviewerScored.reduce((a, b) => a + b, 0) || 0;
  }, [interview.currentInterview?.interviewerScored]);

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
    if (interview.currentStatus !== "finished" || !interview.currentInterview) {
      navigate("/", { replace: true });
    }
  }, [user, interview.currentStatus, interview.currentInterview, navigate]);

  const toggleAccordion = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleRetakeTest = () => {
    dispatch(resetInterview());
    navigate("/interview");
  }

  function handleRetakeSameTest(){
    if (!interview.currentInterview) return;

    const { questions, correctAnswer, weightage } =
    interview.currentInterview;

    dispatch(resetInterview());
    
    dispatch(
      startInterview({
        questions,
        correctAnswer,
        weightage,
      })
    );

    navigate("/interview");
  }
  

  return (
    <div className="bg-lavender-grape p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Score & Summary Section */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center border border-gray-100">
            <h2 className="font-semibold text-gray-700 mb-4">Overall Score</h2>
            <div className="w-32 h-32">
              <CircularProgressbar
                maxValue={30}
                value={totalScore}
                text={`${totalScore}/30`}
                styles={buildStyles({ pathColor: `#272838`, textColor: "#272838", trailColor: "#F3F4F6" })}
              />
            </div>
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-700 mb-2">Performance Summary</h2>
            <p className="text-gray-600 italic leading-relaxed">
              {interview.currentInterview?.aiSummary || "No summary available."}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 px-1">Detailed Breakdown</h2>
          {interview.currentInterview?.questions.map((ques, index) => {
            const isCorrect = (interview.currentInterview?.interviewerScored[index] ?? 0) > 0;
            const isExpanded = expandedId === ques.id;

            return (
              <div key={ques.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => toggleAccordion(ques.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    {isCorrect ? (
                      <CheckCircle className="text-green-500 size-5" />
                    ) : (
                      <XCircle className="text-red-400 size-5" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 leading-tight">{ques.text}</p>
                      <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                        {ques.difficulty} • Score: {interview.currentInterview?.interviewerScored[index]}/{interview.currentInterview?.weightage[index]}
                      </span>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                </button>

                {/* Accordion Content */}
                {isExpanded && (
                  <div className="p-5 bg-gray-50 border-t border-gray-100 grid md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-gray-500 uppercase">Your Answer</h4>
                      <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        {interview.currentInterview?.interviewerAnswer[index] || "No answer provided."}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-green-600 uppercase">Ideal Answer</h4>
                      <p className="text-sm text-gray-700 bg-green-50/50 p-3 rounded-lg border border-green-100 shadow-sm">
                        {interview.currentInterview?.correctAnswer[index]}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => navigate("/")}>Home</Button>
          <Button onClick={handleRetakeTest} variant="secondary">Retake Test</Button>
          <Button onClick={handleRetakeSameTest} variant="secondary">Retake Same Test (Question Will be same)</Button>
        </div>
      </div>
    </div>
  );
}

export default Evaluation;