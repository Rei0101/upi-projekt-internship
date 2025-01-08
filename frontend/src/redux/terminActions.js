import axios from "axios";

export const setTerminiInStore = (termini) => ({
  type: "SET_TERMINI",
  payload: termini,
});

export const fetchTermini = (email) => async (dispatch) => {
  try {
    const response = await axios.post("http://localhost:3000/raspored", { email });
    
    if (response.data.success) {
      dispatch(setTerminiInStore(response.data.termini));
    } else {
      console.error("Greška pri dohvaćanju rasporeda:", response.data.message);
    }
  } catch (error) {
    console.error("Greška pri povezivanju s API-jem:", error);
  }
};
