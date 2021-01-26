import React from "react";
import classes from './HeaderMenu.module.sass';
import InputForm from "../../../common/InputForm/InputForm";
import { limitLength } from "../../../common/Validators";
import MenuList from "./MenuList/MenuList";
import defaultAvatar from "../../../assets/defaultAvatar/ava.jpg";
import camera from "../../../assets/camera.png";
import button from '../../../assets/menu_button.png';
import edit from '../../../assets/edit.png';

const HeaderMenu = ( props ) => {

    return (
        <div className={ classes.menu_container }>
            <div onClick={ props.handleClickMenuButton } className={ classes.menu_button }>
                <img src={ button } alt="Menu"/>
            </div>

            { props.menuIsVisible &&
            <div className={ classes.menu }>
                <div className={ classes.menu_header }>
                    <img src={ props.currentUser.avatar || defaultAvatar } className={ classes.menu_header_avatar } alt="avatar"/>
                    <div className={ classes.select_photo }
                         onClick={ () => props.togglePhotoEditorVisibility(false, true, !props.isMobileVersion, 'Avatar editor') }>
                        <img src={ camera } alt="camera"/>
                    </div>

                    <div className={ classes.menu_header_profile_info }>
                        <div className={ classes.user_name_container }>
                            { props.isEditMode ?
                                <InputForm
                                    formType={ 'edit_user_name' }
                                    inputName={ 'edit_user_name' }
                                    onSubmit={ props.onSubmit }
                                    validators={ [limitLength] }
                                    placeholder={ 'Enter a new name...' }
                                    hideInput={ props.hideInput }
                                    currentUserName={ props.currentUser.name }
                                /> :
                                <>
                                    <div className={ classes.user_name }>{ props.currentUser.name }</div>
                                    <img src={ edit } className={ classes.edit_button } onClick={ props.handleEditMode } alt="edit"/>
                                </>
                            }
                        </div>
                        <div className={ classes.user_phone_number }>{ props.currentUser.phoneNumber }</div>
                    </div>
                </div>

                <MenuList
                    isMobileVersion={ props.isMobileVersion }
                    toggleFindUserMenuVisibility={ props.toggleFindUserMenuVisibility }
                    handleLogOutUser={ props.handleLogOutUser }
                />
            </div>
            }
        </div>
    )
};

export default HeaderMenu