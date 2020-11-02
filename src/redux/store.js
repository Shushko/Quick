import { applyMiddleware, combineReducers, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import dialogsDataReducer from "./dialogsData/dialogsDataReducer";
import currentUser from "./currentUser";
import authUserReducer from "./authUser/authUserReducer";
import displayMenu from "./displayMenu";

const reducers = combineReducers({
    currentUser,
    dialogsDataReducer,
    authUserReducer,
    displayMenu
})

const store = createStore(reducers, applyMiddleware(thunkMiddleware))

window.state = store

export default store