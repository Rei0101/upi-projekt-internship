import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    email: "",
    termini: [],
    notes: "",
    svitermini: [],
    kolokviji:[],
    zahtjevi:[]
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
      state.svitermini = action.payload
    },setZahtjevi:(state,action)=>{
      state.zahtjevi=action.payload
    },
    setKolokviji:(state,action)=>{
      state.kolokviji=action.payload
    },
    
  },

});

export const { setUserEmail, setTermini, setNotes, setSviTermini,setKolokviji,setZahtjevi } = userSlice.actions;
export default userSlice.reducer;
