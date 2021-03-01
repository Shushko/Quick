import { applyMiddleware, combineReducers, createStore, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import dialogsReducer from "./dialogs/dialogsReducer";
import userProfile from "./userProfile";
import displayModalElements from "./displayModalElements";
import findUsers from "./findUsers";
import preloader from "./preloader";
import notification from "./notification";
import appState from "./appState";

const reducers = combineReducers({
    appState,
    dialogsReducer,
    userProfile,
    displayModalElements,
    findUsers,
    preloader,
    notification
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers, composeEnhancers(applyMiddleware(thunkMiddleware)));

export default store