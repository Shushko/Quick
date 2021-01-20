import React, { useState } from "react";
import classes from './BurgerMenu.module.sass'
import * as PropTypes from 'prop-types';
import { connect } from "react-redux";
import defaultAvatar from '../../../assets/defaultAvatar/ava.jpg'
import button from '../../../assets/menu_button.png'
import edit from '../../../assets/edit.png'
import camera from '../../../assets/camera.png'
import exit from '../../../assets/exit.png'
import create from '../../../assets/create.png'
import {
    toggleMenuVisibility,
    togglePhotoEditorVisibility,
    toggleFindUserMenuVisibility,
    hideAllModalWindows
} from "../../../redux/displayModalElements";
import { changeUserName, logOutUser } from "../../../redux/dialogsData/dialogsDataActions";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import InputForm from "../../../common/InputForm/InputForm";
import { limitLength } from "../../../common/Validators";

const BurgerMenu = (props) => {

    const [isEditMode, setIsEditMode] = useState(false);

    const logOutUser = () => {
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

    return (
        <div className={ classes.menu_container }>
            <div
                onClick={ () => props.toggleMenuVisibility(!props.menuIsVisible) }
                className={ classes.menu_button }
            >
                <img src={ button } alt="Menu" />
            </div>

            { props.currentUser &&
            <div className={ props.menuIsVisible ? classes.menu_active : classes.menu }>
                <div className={ classes.header }>
                    <img src={ props.currentUser.avatar || defaultAvatar } className={ classes.avatar } alt="avatar"/>
                    <div className={ classes.select_photo } onClick={ () => props.togglePhotoEditorVisibility(false, true, true) }>
                        <label htmlFor="file_input">
                            <img src={ camera } alt="camera"/>
                        </label>
                    </div>

                    <div className={ classes.profileInfo }>
                        <div className={ classes.user_name }>
                            { isEditMode ?
                                <InputForm
                                    formType={ 'edit_user_name' }
                                    inputName={ 'edit_user_name' }
                                    onSubmit={ onSubmit }
                                    validators={ [limitLength] }
                                    placeholder={ 'Enter a new name...' }
                                    hideInput={ hideInput }
                                    currentUserName={ props.currentUser.name }
                                /> :
                                <span>{ props.currentUser.name }</span> }
                            <img src={ edit } className={ classes.edit_button } onClick={ handleEditMode } alt="edit"/>
                        </div>
                        <div className={ classes.user_phone_number }>{ props.currentUser.phoneNumber }</div>
                    </div>
                </div>

                <div className={ classes.menu_list }>
                    <div className={ classes.menu_list_item } onClick={ () => props.toggleFindUserMenuVisibility(false, true, true) }>
                        <div className={ classes.menu_list_item_button }>
                            <img src={ create }/>
                            <span>Find User</span>
                        </div>
                    </div>
                    <div className={ classes.menu_list_item } onClick={ logOutUser }>
                        <div className={ classes.menu_list_item_button }>
                            <img src={ exit }/>
                            <span>Log Out</span>
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.dialogsDataReducer.currentUser,
    menuIsVisible: state.displayModalElements.menuIsVisible
});

const mapDispatchToProps = (dispatch) => ({
    toggleFindUserMenuVisibility: (menuIsVisible, findUserMenuIsVisible, darkBackgroundIsVisible) => {
        dispatch(toggleFindUserMenuVisibility(menuIsVisible, findUserMenuIsVisible, darkBackgroundIsVisible))
    },
    togglePhotoEditorVisibility: (menuIsVisible, photoEditorIsVisible, darkBackgroundIsVisible) => {
        dispatch(togglePhotoEditorVisibility(menuIsVisible, photoEditorIsVisible, darkBackgroundIsVisible))
    },
    toggleMenuVisibility: (menuIsVisible) => dispatch(toggleMenuVisibility(menuIsVisible)),
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