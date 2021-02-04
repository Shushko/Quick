import React, { useState } from "react";
import * as PropTypes from 'prop-types';
import { connect } from "react-redux";
import {
    toggleMenuVisibility,
    togglePhotoEditorVisibility,
    toggleFindUserMenuVisibility,
    hideAllModalWindows
} from "../../../redux/displayModalElements";
import { changeUserName, logOutUser } from "../../../redux/userProfile";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import HeaderMenu from "./HeaderMenu";

const HeaderMenuContainer = (props) => {

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

    const handleClickMenuButton = () => {
        const activeTitle = props.menuIsVisible ? '' : 'Menu';
        props.toggleMenuVisibility(!props.menuIsVisible, !props.isMobileVersion, activeTitle)
    };

    const hideInput = () => setIsEditMode(false);

    return <HeaderMenu
        isMobileVersion={ props.isMobileVersion }
        isEditMode={ isEditMode }
        handleClickMenuButton={ handleClickMenuButton }
        handleLogOutUser={ handleLogOutUser }
        onSubmit={ onSubmit }
        handleEditMode={ handleEditMode }
        hideInput={ hideInput }
        currentUser={ props.currentUser }
        menuIsVisible={ props.menuIsVisible }
        toggleFindUserMenuVisibility={ props.toggleFindUserMenuVisibility }
        togglePhotoEditorVisibility={ props.togglePhotoEditorVisibility }
    />
};

const mapStateToProps = (state) => ({
    isMobileVersion: state.appState.isMobileVersion,
    currentUser: state.userProfile.currentUser,
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

HeaderMenuContainer.propTypes = {
    currentUser: PropTypes.object,
    menuIsVisible: PropTypes.bool,
    toggleMenuVisibility: PropTypes.func,
    togglePhotoEditorVisibility: PropTypes.func,
    toggleFindUserMenuVisibility: PropTypes.func,
    changeUserName: PropTypes.func,
    hideAllModalWindows: PropTypes.func,
    logOutUser: PropTypes.func,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(HeaderMenuContainer)