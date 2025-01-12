import { combineReducers } from "redux";
import terminReducer from "./terminReducer";

const rootReducer = combineReducers({
  termin: terminReducer,
});

export default rootReducer;
