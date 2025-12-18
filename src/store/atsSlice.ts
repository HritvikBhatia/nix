import { createSlice } from "@reduxjs/toolkit"

type CurrentState = "not Started" | "Finished"

interface Ats{
    atsScore : number;
    summary : string;
    improvements : string[];
}

interface initial{
    currentState: CurrentState
    ats: Ats | null
}

const initialState : initial = {
    currentState: "not Started",
    ats : null
}

export const atsSlice = createSlice({
    name: "ats",
    initialState,
    reducers : {
        addAts : (state, action) => {
            state.currentState = "Finished"
            state.ats = action.payload
        },

        clearAts : (state) => {
            state.ats = null
        }
    }
})

export const {addAts, clearAts} = atsSlice.actions;
export default atsSlice.reducer;