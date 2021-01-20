import React, { useEffect } from 'react';
import './App.sass';
import * as PropTypes from 'prop-types';
import FindUser from "./components/FindUser/FindUser";
import AvatarEditor from "./components/AvatarEditor/AvatarEditor";
import TheHeader from "./components/Header/TheHeader";
import ChatSection from "./components/ChatSection/ChatSection";
import UserDialogs from "./components/DialogsSection/UserDialogs";
import AuthUser from "./components/AuthUser/AuthUser";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { hideAllModalWindows, togglePhotoEditorVisibility } from "./redux/displayModalElements";
import Preloader from "./common/Preloader/Preloader";
import { changeUserAvatar, onChangeCurrentDialog, setDialogs } from "./redux/dialogsData/dialogsDataActions";
import { togglePhotoEditorPreloader } from "./redux/preloader";
import { toggleNotificationVisibility } from "./redux/notification";

const App = (props) => {

    useEffect(() => {
        !props.appIsInitialized && props.userIsAuthorized && props.setDialogs(props.history)
    }, [props.appIsInitialized, props.userIsAuthorized]);
    useEffect(() => props.onChangeCurrentDialog(props.match.params.dialogId));

    return (
        <div className="app_container">
            <div
                className={ props.displayModalElements.darkBackgroundIsVisible ? "bg_menu_active" : "bg_menu" }
                onClick={ () => props.hideAllModalWindows() }
            />
            { props.displayModalElements.findUserMenuIsVisible && <FindUser /> }
            { props.displayModalElements.photoEditorIsVisible &&
            <AvatarEditor
                changeUserAvatar={ props.changeUserAvatar }
                currentUserId={ props.currentUser.id }
                togglePhotoEditorVisibility={ props.togglePhotoEditorVisibility }
                preloader={ props.preloader }
                togglePhotoEditorPreloader={ props.togglePhotoEditorPreloader }
                notification={ props.notification }
                toggleNotificationVisibility={ props.toggleNotificationVisibility }
            /> }

            { props.userIsAuthorized ?
                    <>
                        { props.appIsInitialized ?
                            <div className="app_wrapper">
                                <TheHeader/>
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
    currentUser: state.dialogsDataReducer.currentUser,
    appIsInitialized: state.dialogsDataReducer.appIsInitialized,
    userIsAuthorized: state.authUser.userIsAuthorized,
    displayModalElements: state.displayModalElements,
    preloader: state.preloader.photoEditorPreloaderIsVisible,
    notification: state.notification
});

const mapDispatchToProps = (dispatch) => ({
    setDialogs: (routeHistory) => { dispatch(setDialogs(routeHistory)) },
    onChangeCurrentDialog: (value) => { dispatch(onChangeCurrentDialog(value)) },
    changeUserAvatar: (file, userID) => dispatch(changeUserAvatar(file, userID)),
    togglePhotoEditorVisibility: (menuIsVisible, photoEditorIsVisible, darkBackgroundIsVisible) => {
        dispatch(togglePhotoEditorVisibility(menuIsVisible, photoEditorIsVisible, darkBackgroundIsVisible))
    },
    hideAllModalWindows: () => dispatch(hideAllModalWindows()),
    togglePhotoEditorPreloader: (value) => dispatch(togglePhotoEditorPreloader(value)),
    toggleNotificationVisibility: (isVisible, notificationContent) => dispatch(toggleNotificationVisibility(isVisible, notificationContent))
});

App.propTypes = {
    currentUser: PropTypes.object,
    appIsInitialized: PropTypes.bool,
    userIsAuthorized: PropTypes.bool,
    preloader: PropTypes.bool,
    notificationIsVisible: PropTypes.bool,
    displayModalElements: PropTypes.object,
    setDialogs: PropTypes.func,
    onChangeCurrentDialog: PropTypes.func,
    togglePhotoEditorPreloader: PropTypes.func,
    toggleNotificationVisibility: PropTypes.func,
    hideAllModalWindows: PropTypes.func
};

export default compose(connect(mapStateToProps,mapDispatchToProps), withRouter)(App)
