import { configureStore } from "@reduxjs/toolkit";
import interviewReducer  from "./interviewSlice"
import resumeReducer  from "./resumeSlice";
export const store = configureStore({
    reducer: {
        interview: interviewReducer,
        resume: resumeReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;