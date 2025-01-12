const initialState = {
    termini: [],
  };
  
  const terminReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_TERMINI":
        return {
          ...state,
          termini: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default terminReducer;
  