import React, { useEffect } from 'react';
import './App.sass';
import * as PropTypes from 'prop-types';
import TheHeader from "./components/Header/TheHeader";
import ChatSection from "./components/ChatSection/ChatSection";
import UserDialogs from "./components/DialogsSection/UserDialogs";
import AuthUser from "./components/AuthUser/AuthUser";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { toggleElementVisibility } from "./redux/displayMenu";
import Preloader from "./common/Preloader/Preloader";
import { onChangeCurrentDialog, setDialogs } from "./redux/dialogsData/dialogsDataActions";
import FindUser from "./components/FindUser/FindUser";

const App = (props) => {

    useEffect(() => props.onChangeCurrentDialog(props.match.params.dialogId));

    return (
        <div className="app_container">
            <div
                className={ props.displayMenu.darkBackgroundIsVisible ? "bg_menu_active" : "bg_menu" }
                onClick={ () => props.toggleElementVisibility(false, false, false) }
            />
            { props.displayMenu.findUserMenuIsVisible && <FindUser/> }
            { props.userIsAuthorized ?
                    <>
                        { !props.appIsInitialized && props.setDialogs(props.history) }
                        { props.appIsInitialized ?
                            <div className="app_wrapper">
                                <TheHeader/>
                                <div className="main_content">
                                    <UserDialogs/>
                                    <ChatSection/>
                                </div>
                            </div> : <Preloader/> }
                    </> : <AuthUser/> }
        </div>
    )
};

const mapStateToProps = (state) => ({
    appIsInitialized: state.dialogsDataReducer.appIsInitialized,
    userIsAuthorized: state.authUser.userIsAuthorized,
    displayMenu: state.displayMenu
});

const mapDispatchToProps = (dispatch) => ({
    setDialogs: (routeHistory) => { dispatch(setDialogs(routeHistory)) },
    onChangeCurrentDialog: (value) => { dispatch(onChangeCurrentDialog(value)) },
    toggleElementVisibility: (menuIsVisible, findUserMenuIsVisible, darkBackgroundIsVisible) => {
        dispatch(toggleElementVisibility(menuIsVisible, findUserMenuIsVisible, darkBackgroundIsVisible))
    }
});

App.propTypes = {
    appIsInitialized: PropTypes.bool,
    userIsAuthorized: PropTypes.bool,
    displayMenu: PropTypes.object,
    setDialogs: PropTypes.func,
    onChangeCurrentDialog: PropTypes.func,
    toggleElementVisibility: PropTypes.func
};

export default compose(connect(mapStateToProps,mapDispatchToProps), withRouter)(App)
