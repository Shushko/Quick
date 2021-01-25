import React, { useEffect } from 'react';
import './App.sass';
import * as PropTypes from 'prop-types';
import TheHeaderMob from "./components/Header/TheHeaderMob/TheHeaderMob";
import TheHeader from "./components/Header/TheHeader/TheHeader";
import FindUser from "./components/FindUser/FindUser";
import AvatarEditor from "./components/AvatarEditor/AvatarEditor";
import ChatSection from "./components/ChatSection/ChatSection";
import UserDialogs from "./components/DialogsSection/UserDialogs";
import AuthUser from "./components/AuthUser/AuthUser";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { hideAllModalWindows } from "./redux/displayModalElements";
import Preloader from "./common/Preloader/Preloader";
import { onChangeCurrentDialog, setDialogs } from "./redux/dialogsData/dialogsDataActions";
import { changeScreenWidth, toggleAppVersion } from "./redux/appState";


const App = (props) => {
    props.toggleAppVersion(window.innerWidth <= 700);
    !props.screenWidth && props.changeScreenWidth(window.innerWidth);

    window.addEventListener('resize', () => {
        if (window.innerWidth <= 700) {
            !props.isMobileVersion && props.toggleAppVersion(true);
            props.changeScreenWidth(window.innerWidth)
        } else {
            props.isMobileVersion && props.toggleAppVersion(false)
        }
    });

    useEffect(() => {
        !props.appIsInitialized && props.userIsAuthorized && props.setDialogs(props.history)
    }, [props.appIsInitialized, props.userIsAuthorized]);

    useEffect(() => props.onChangeCurrentDialog(props.match.params.dialogId));

    return (
        <div className="app_container">
            { props.displayModalElements.darkBackgroundIsVisible && <div className={ "dark_background" } onClick={ () => props.hideAllModalWindows() } /> }

            { props.displayModalElements.findUserMenuIsVisible && <FindUser /> }

            { props.displayModalElements.photoEditorIsVisible && <AvatarEditor /> }

            { props.userIsAuthorized ?
                <>
                    { props.appIsInitialized ?
                        <div className="app_wrapper">
                            { props.isMobileVersion ? <TheHeaderMob /> : <TheHeader /> }

                            <div className="main_content">
                                <UserDialogs/>
                                <ChatSection/>
                            </div>
                        </div> : <Preloader type={ 'default' }/> }
                </> : <AuthUser/> }
        </div>
    )
};

const mapStateToProps = (state) => ({
    isMobileVersion: state.appState.isMobileVersion,
    screenWidth: state.appState.screenWidth,
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
    setDialogs: PropTypes.func,
    onChangeCurrentDialog: PropTypes.func,
    hideAllModalWindows: PropTypes.func
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(App)
