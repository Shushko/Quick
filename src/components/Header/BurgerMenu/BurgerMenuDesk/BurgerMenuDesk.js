import React from "react";
import classes from './BurgerMenuDesk.module.sass';
import button from '../../../../assets/menu_button.png';
import edit from '../../../../assets/edit.png';
import InputForm from "../../../../common/InputForm/InputForm";
import { limitLength } from "../../../../common/Validators";
import UserAvatar from "../UserAvatar/UserAvatar";
import MenuList from "../MenuList/MenuList";

const BurgerMenuDesk = ({ props }) => {

    return (
        <div className={ classes.menu_container }>
            <div onClick={ () => props.toggleMenuVisibility(!props.menuIsVisible, !props.menuIsVisible) } className={ classes.menu_button }>
                <img src={ button } alt="Menu"/>
            </div>

            <div className={ props.menuIsVisible ? classes.menu_active : classes.menu }>
                <div className={ classes.header }>
                    <UserAvatar
                        currentUser={ props.currentUser }
                        togglePhotoEditorVisibility={ props.togglePhotoEditorVisibility }
                    />

                    <div className={ classes.profileInfo }>
                        <img src={ edit } className={ classes.edit_button } onClick={ props.handleEditMode } alt="edit"/>
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
                                <div className={ classes.user_name }>{ props.currentUser.name }</div> }
                        </div>
                        <div className={ classes.user_phone_number }>{ props.currentUser.phoneNumber }</div>
                    </div>
                </div>

                <MenuList toggleFindUserMenuVisibility={ props.toggleFindUserMenuVisibility } />

            </div>
        </div>
    )
};

export default BurgerMenuDesk