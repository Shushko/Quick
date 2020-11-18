import { applyMiddleware, combineReducers, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import dialogsDataReducer from "./dialogsData/dialogsDataReducer";
import currentUser from "./currentUser";
import authUserReducer from "./authUser/authUserReducer";
import displayMenu from "./displayMenu";
import findUsers from "./findUsers";

const reducers = combineReducers({
    currentUser,
    dialogsDataReducer,
    authUserReducer,
    displayMenu,
    findUsers
})

const store = createStore(reducers, applyMiddleware(thunkMiddleware))

export default store