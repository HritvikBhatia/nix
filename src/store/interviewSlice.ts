import { createSlice} from "@reduxjs/toolkit";


type Status = "not started" | "running" | "finished";
type Difficulty = "easy" | "medium" | "hard"

interface Question {
  id: number;
  text: string;
  difficulty: Difficulty;
}

interface Interview {
  questions: Question[];
  interviewerAnswer: string[]; // change to string[] or a different shape if needed
  correctAnswer: string[];
  timer: number | null;
  weightage: number[];
  interviewerScored: number[];
  totalMarks: number;
  aiSummary: string | null;
}

interface InterviewState {
  currentStatus: Status;
  currentInterview: Interview | null;
}

const initialState:InterviewState = {
    currentStatus: "not started",
    currentInterview: null
}


export const interviewSlice = createSlice({
    name: "interview",
    initialState,
    reducers :{
        startInterview : (state, action) => {
            state.currentStatus = "running"
            state.currentInterview = {
                questions: action.payload.questions,
                interviewerAnswer: [],
                correctAnswer: action.payload.correctAnswer,
                timer:600,
                weightage: action.payload.weightage,
                interviewerScored: [],
                totalMarks: 30,
                aiSummary: null,
            }
        },
        submitInterview: (state, action) =>{
          if(!state.currentInterview) return;
          state.currentStatus = "finished";
          state.currentInterview.interviewerAnswer = action.payload
        },

        evaluateInterview : (state, action) => {
          if(!state.currentInterview) return;
            state.currentInterview.interviewerScored = action.payload.interviewerScored
            state.currentInterview.aiSummary = action.payload.aiSummary
        },
        
        resetInterview: (state) => {
          state.currentStatus = "not started";
          state.currentInterview = null;
        },

    }
})

export const {startInterview, submitInterview, evaluateInterview, resetInterview}= interviewSlice.actions;
export default interviewSlice.reducer;