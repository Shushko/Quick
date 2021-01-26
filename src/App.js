import React, { useEffect } from 'react';
import './App.sass';
import * as PropTypes from 'prop-types';
import TheHeader from "./components/TheHeader/TheHeader";
import FindUser from "./components/FindUser/FindUser";
import AvatarEditor from "./components/AvatarEditor/AvatarEditor";
import ChatSection from "./components/ChatSection/ChatSection";
import UserDialogs from "./components/DialogsSection/UserDialogs";
import AuthUser from "./components/AuthUser/AuthUser";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { useResizeDetector  } from 'react-resize-detector';
import { hideAllModalWindows } from "./redux/displayModalElements";
import Preloader from "./common/Preloader/Preloader";
import { onChangeCurrentDialog, setDialogs } from "./redux/dialogsData/dialogsDataActions";
import { changeScreenWidth, toggleAppVersion } from "./redux/appState";


const App = (props) => {
    const { width, ref } = useResizeDetector();

    useEffect(() => {
        if (width <= 700) {
            !props.isMobileVersion && props.toggleAppVersion(true);
            props.changeScreenWidth(width)
        } else {
            props.isMobileVersion && props.toggleAppVersion(false);
        }
    }, [width]);

    useEffect(() => {
        !props.appIsInitialized && props.userIsAuthorized && props.setDialogs(props.history)
    }, [props.appIsInitialized, props.userIsAuthorized]);

    useEffect(() => props.onChangeCurrentDialog(props.match.params.dialogId));

    return (
        <div className="app_container" ref={ ref }>
            { props.displayModalElements.darkBackgroundIsVisible &&
            <div className={ "dark_background" } onClick={ () => props.hideAllModalWindows() } /> }

            { props.displayModalElements.findUserMenuIsVisible && <FindUser /> }

            { props.displayModalElements.photoEditorIsVisible && <AvatarEditor /> }

            { props.userIsAuthorized ?
                <>
                    { props.appIsInitialized ?
                        <div className="app_wrapper">
                            <TheHeader />

                            <div className="main_content">
                                <UserDialogs />
                                <ChatSection />
                            </div>
                        </div> : <Preloader type={ 'default' } /> }
                </> : <AuthUser/> }
        </div>
    )
};

const mapStateToProps = (state) => ({
    isMobileVersion: state.appState.isMobileVersion,
    appIsInitialized: state.dialogsDataReducer.appIsInitialized,
    userIsAuthorized: state.authUser.userIsAuthorized,
    displayModalElements: state.displayModalElements,
});

const mapDispatchToProps = (dispatch) => ({
    toggleAppVersion: (isMobileVersion) => dispatch(toggleAppVersion(isMobileVersion)),
    changeScreenWidth: (screenWidth) => dispatch(changeScreenWidth(screenWidth)),
    setDialogs: (routeHistory) => { dispatch(setDialogs(routeHistory)) },
    onChangeCurrentDialog: (value) => { dispatch(onChangeCurrentDialog(value)) },
    hideAllModalWindows: () => dispatch(hideAllModalWindows()),
});

App.propTypes = {
    appIsInitialized: PropTypes.bool,
    userIsAuthorized: PropTypes.bool,
    isMobileVersion: PropTypes.bool,
    displayModalElements: PropTypes.object,
    toggleAppVersion: PropTypes.func,
    changeScreenWidth: PropTypes.func,
    setDialogs: PropTypes.func,
    onChangeCurrentDialog: PropTypes.func,
    hideAllModalWindows: PropTypes.func
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(App)
