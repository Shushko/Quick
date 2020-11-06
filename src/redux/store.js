import { applyMiddleware, combineReducers, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
//import { reducer as formReducer } from 'redux-form'
import dialogsDataReducer from "./dialogsData/dialogsDataReducer";
import currentUser from "./currentUser";
import authUserReducer from "./authUser/authUserReducer";
import displayMenu from "./displayMenu";

const reducers = combineReducers({
    currentUser,
    dialogsDataReducer,
    authUserReducer,
    displayMenu,
    //form: formReducer
})

const store = createStore(reducers, applyMiddleware(thunkMiddleware))

export default store