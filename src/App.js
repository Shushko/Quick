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
import { withRouter, Route, Switch } from "react-router-dom";
import { compose } from "redux";
import { useResizeDetector } from 'react-resize-detector';
import { hideAllModalWindows } from "./redux/displayModalElements";
import Preloader from "./common/Preloader/Preloader";
import { setUserDialogs } from "./redux/dialogs/dialogsActions";
import { changeScreenWidth, toggleAppVersion } from "./redux/appState";

const App = (props) => {

    const { width, ref } = useResizeDetector();

    useEffect(() => {
        ref.current && ref.current.style.setProperty('--vh', `${ window.innerHeight / 100 }px`)
    }, []);

    useEffect(() => {
        if (width <= 700 && !props.isMobileVersion) {
            props.toggleAppVersion(true);
            props.history.push(`/`);
            props.changeScreenWidth(width)
        } else if (width > 700 && props.isMobileVersion) {
            props.toggleAppVersion(false);
        }
    }, [width]);

    useEffect(() => {
        !props.appIsInitialized && props.userIsAuthorized && props.setUserDialogs(props.history);
    }, [props.appIsInitialized, props.userIsAuthorized]);

    return (
        <div className="app_container" ref={ ref }>
            { props.displayModalElements.darkBackgroundIsVisible &&
            <div className={ "dark_background" } onClick={ () => props.hideAllModalWindows() }/> }

            { props.displayModalElements.findUserMenuIsVisible && <FindUser/> }

            { props.displayModalElements.photoEditorIsVisible && <AvatarEditor/> }

            { props.userIsAuthorized ?
                <>
                    { props.appIsInitialized ?
                        <div className="app_wrapper">
                            <TheHeader/>

                            <main className="main_content">
                                { props.isMobileVersion ?
                                    <Switch>
                                        <Route exact path='/' component={ UserDialogs } />
                                        <Route path='/:dialogId' component={ ChatSection } />
                                    </Switch>
                                    :
                                    <>
                                        <UserDialogs/>
                                        <ChatSection/>
                                    </> }
                            </main>
                        </div> : <Preloader type={ 'start' }/> }
                </> : <AuthUser/> }
        </div>
    )
};

const mapStateToProps = (state) => ({
    isMobileVersion: state.appState.isMobileVersion,
    appIsInitialized: state.appState.appIsInitialized,
    userIsAuthorized: state.userProfile.userIsAuthorized,
    displayModalElements: state.displayModalElements,
});

const mapDispatchToProps = (dispatch) => ({
    toggleAppVersion: (isMobileVersion) => dispatch(toggleAppVersion(isMobileVersion)),
    changeScreenWidth: (screenWidth) => dispatch(changeScreenWidth(screenWidth)),
    setUserDialogs: (routeHistory) => { dispatch(setUserDialogs(routeHistory)) },
    hideAllModalWindows: () => dispatch(hideAllModalWindows()),
});

App.propTypes = {
    appIsInitialized: PropTypes.bool,
    userIsAuthorized: PropTypes.bool,
    isMobileVersion: PropTypes.bool,
    displayModalElements: PropTypes.object,
    toggleAppVersion: PropTypes.func,
    changeScreenWidth: PropTypes.func,
    onChangeCurrentDialog: PropTypes.func,
    hideAllModalWindows: PropTypes.func,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(App)
