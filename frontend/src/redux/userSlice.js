import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    email: "",
    termini: [],
    notes: "",
    sviTermini: [],
    kolokviji:[]
  },
  reducers: {
    setUserEmail: (state, action) => {
      state.email = action.payload;
    },
    setTermini: (state, action) => {
      state.termini = action.payload;
    },
    setNotes: (state, action) => { 
      state.notes = action.payload },
    setSviTermini: (state, action) => {
      state.sviTermini = action.payload
    },
    setKolokviji:(state,action)=>{
      state.kolokviji=action.payload
    }
  },

});

export const { setUserEmail, setTermini, setNotes, setSviTermini,setKolokviji } = userSlice.actions;
export default userSlice.reducer;
