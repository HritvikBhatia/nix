import { createSlice } from "@reduxjs/toolkit";

interface UserProfile {
  name?: string | null;
  email?: string | null;
  about?: string | null;
  skills?: string | null;
  experience?: string | null;
  projects?: string | null;
  education?: string | null;
  isResume?: "resume" | "notResume";
}

interface userState{
    user: UserProfile | null;
}

const initialState: userState = {
    user: null
}

export const resumeSlice = createSlice({
    name: "resume",
    initialState,
    reducers:{
        addUser: (state, action) =>{
            state.user = action.payload
        },

        clearResume: (state) =>{
            state.user = null
        }
    }
})

export const {addUser, clearResume} = resumeSlice.actions;
export default resumeSlice.reducer;