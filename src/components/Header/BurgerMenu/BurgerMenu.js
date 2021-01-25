import React, { useState } from "react";
import * as PropTypes from 'prop-types';
import { connect } from "react-redux";
import {
    toggleMenuVisibility,
    togglePhotoEditorVisibility,
    toggleFindUserMenuVisibility,
    hideAllModalWindows
} from "../../../redux/displayModalElements";
import { changeUserName, logOutUser } from "../../../redux/dialogsData/dialogsDataActions";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import BurgerMenuMob from "./BurgerMenuMob/BurgerMenuMob";
import BurgerMenuDesk from "./BurgerMenuDesk/BurgerMenuDesk";

const BurgerMenu = (props) => {

    const [isEditMode, setIsEditMode] = useState(false);

    const handleLogOutUser = () => {
        props.hideAllModalWindows();
        props.history.push(`/`);
        props.logOutUser();
    };

    const onSubmit = (formData) => {
        props.changeUserName(formData['edit_user_name'], props.currentUser.id);
        setIsEditMode(false)
    };

    const handleEditMode = () => setIsEditMode(!isEditMode);

    const hideInput = () => setIsEditMode(false);

    const propsObj = {
        isMobileVersion: props.isMobileVersion,
        isEditMode: isEditMode,
        handleLogOutUser: handleLogOutUser,
        onSubmit: onSubmit,
        handleEditMode: handleEditMode,
        hideInput: hideInput,
        currentUser: props.currentUser,
        menuIsVisible: props.menuIsVisible,
        toggleFindUserMenuVisibility: props.toggleFindUserMenuVisibility,
        togglePhotoEditorVisibility: props.togglePhotoEditorVisibility,
        toggleMenuVisibility: props.toggleMenuVisibility,
        changeUserName: props.changeUserName,
        hideAllModalWindows: props.hideAllModalWindows,
        logOutUser: props.logOutUser
    };

    return (
        <>
            { props.isMobileVersion ? <BurgerMenuMob props={ propsObj }/> : <BurgerMenuDesk props={ propsObj } /> }
        </>
    )
};

const mapStateToProps = (state) => ({
    isMobileVersion: state.appState.isMobileVersion,
    currentUser: state.dialogsDataReducer.currentUser,
    menuIsVisible: state.displayModalElements.menuIsVisible
});

const mapDispatchToProps = (dispatch) => ({
    toggleFindUserMenuVisibility: (menuIsVisible, findUserMenuIsVisible, darkBackgroundIsVisible, activeTitle) => {
        dispatch(toggleFindUserMenuVisibility(menuIsVisible, findUserMenuIsVisible, darkBackgroundIsVisible, activeTitle))
    },
    togglePhotoEditorVisibility: (menuIsVisible, photoEditorIsVisible, darkBackgroundIsVisible, activeTitle) => {
        dispatch(togglePhotoEditorVisibility(menuIsVisible, photoEditorIsVisible, darkBackgroundIsVisible, activeTitle))
    },
    toggleMenuVisibility: (menuIsVisible, darkBackgroundIsVisible, activeTitle) => {
        dispatch(toggleMenuVisibility(menuIsVisible, darkBackgroundIsVisible, activeTitle))
    },
    changeUserName: (newUserName, userId) => dispatch(changeUserName(newUserName, userId)),
    hideAllModalWindows: () => dispatch(hideAllModalWindows()),
    logOutUser: () => dispatch(logOutUser())
});

BurgerMenu.propTypes = {
    currentUser: PropTypes.object,
    menuIsVisible: PropTypes.bool,
    toggleMenuVisibility: PropTypes.func,
    togglePhotoEditorVisibility: PropTypes.func,
    toggleFindUserMenuVisibility: PropTypes.func,
    changeUserName: PropTypes.func,
    hideAllModalWindows: PropTypes.func,
    logOutUser: PropTypes.func,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(BurgerMenu)