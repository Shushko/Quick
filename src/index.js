import React from 'react';
import * as firebase from 'firebase/app'
import 'firebase/database'
import './index.css';
import store from "./redux/store";
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from "react-router-dom";
import { Route } from "react-router-dom";
import { Provider } from "react-redux";

firebase.initializeApp({
    apiKey: "AIzaSyAmHQmxeKcqcreCehBBXMtQdcc755ciDBs",
    authDomain: "mymessenger-50d8e.firebaseapp.com",
    databaseURL: "https://mymessenger-50d8e.firebaseio.com",
    projectId: "mymessenger-50d8e",
    storageBucket: "mymessenger-50d8e.appspot.com",
    messagingSenderId: "495625166359",
    appId: "1:495625166359:web:2569d80a5efaf76774c652"
});

const root = document.getElementById('root');

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Route path="/:dialogId?">
                <Provider store={ store }>
                    <App/>
                </Provider>
            </Route>
        </BrowserRouter>
    </React.StrictMode>,
    root
);

serviceWorker.unregister();