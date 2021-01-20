import { applyMiddleware, combineReducers, createStore, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import dialogsDataReducer from "./dialogsData/dialogsDataReducer";
import authUser from "./authUser";
import displayModalElements from "./displayModalElements";
import findUsers from "./findUsers";
import preloader from "./preloader";
import sendNewMessage from "./sendNewMessage"
import notification from "./notification";

const reducers = combineReducers({
    dialogsDataReducer,
    authUser,
    displayModalElements,
    findUsers,
    preloader,
    notification,
    sendNewMessage
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers, composeEnhancers(applyMiddleware(thunkMiddleware)));

export default store