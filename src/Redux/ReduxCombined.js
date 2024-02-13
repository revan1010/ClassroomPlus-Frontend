import { combineReducers } from "redux";
import authReducer from "./AuthReducer";
import roomsDataReducer from "./RoomsDataReducer";

const ReduxCombined = combineReducers({
    authReducer,
    roomsDataReducer
})

export default ReduxCombined;