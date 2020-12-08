import { applyMiddleware, combineReducers, createStore, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import dialogsDataReducer from "./dialogsData/dialogsDataReducer";
import authUserReducer from "./authUser/authUserReducer";
import displayMenu from "./displayMenu";
import findUsers from "./findUsers";
import preloader from "./preloader";
import sendNewMessage from "./sendNewMessage"

const reducers = combineReducers({
    dialogsDataReducer,
    authUserReducer,
    displayMenu,
    findUsers,
    preloader,
    sendNewMessage
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers, composeEnhancers(applyMiddleware(thunkMiddleware)));

export default store