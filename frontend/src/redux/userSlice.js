import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    email: "",
    termini: [],
  },
  reducers: {
    setUserEmail: (state, action) => {
      state.email = action.payload;
    },
    setTermini: (state, action) => {
      state.termini = action.payload;
    },
  },
});

export const { setUserEmail, setTermini } = userSlice.actions;
export default userSlice.reducer;
