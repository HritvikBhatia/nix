import { createSlice} from "@reduxjs/toolkit";


type Status = "not started" | "running" | "finished";
type Difficulty = "easy" | "medium" | "hard"

interface Question {
  id?: string | number;
  text: string;
  difficulty: Difficulty;
}

interface Interview {
  questions: Question[];
  currentQuestionIndex: number;
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
                currentQuestionIndex: 0,
                interviewerAnswer: [],
                correctAnswer: action.payload.correctAnswer,
                timer:600,
                weightage: action.payload.weightage,
                interviewerScored: [],
                totalMarks: 30,
                aiSummary: null,
            }
        },
        answerQuestion: (state, action) =>{
          if(!state.currentInterview) return;
          const idx = state.currentInterview.currentQuestionIndex;
          state.currentInterview.correctAnswer[idx] = action.payload;
        }

    }
})

export const {startInterview}= interviewSlice.actions;
export default interviewSlice.reducer;