import React from "react";
import classes from './BurgerMenuMob.module.sass';
import button from '../../../../assets/menu_button.png';
import edit from '../../../../assets/edit.png';
import InputForm from "../../../../common/InputForm/InputForm";
import { limitLength } from "../../../../common/Validators";
import UserAvatar from "../UserAvatar/UserAvatar";
import MenuList from "../MenuList/MenuList";

const BurgerMenuMob = ({ props }) => {

    const handleClickMenuButton = () => {
        const activeTitle = props.menuIsVisible ? '' : 'Menu';
        props.toggleMenuVisibility(!props.menuIsVisible, false, activeTitle)
    };

    return (
        <div className={ classes.menu_container }>
            <div onClick={ handleClickMenuButton } className={ classes.menu_button }>
                <img src={ button } alt="Menu"/>
            </div>

            { props.menuIsVisible &&
            <div className={ classes.menu }>
                <div className={ classes.menu_header }>
                    <UserAvatar
                        isMobileVersion={ props.isMobileVersion }
                        currentUser={ props.currentUser }
                        togglePhotoEditorVisibility={ props.togglePhotoEditorVisibility }
                    />

                    <div className={ classes.profileInfo }>
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
                                    <img src={ edit } className={ classes.edit_button } onClick={ props.handleEditMode }
                                         alt="edit"/>
                                </>
                            }
                        </div>
                        <div className={ classes.user_phone_number }>{ props.currentUser.phoneNumber }</div>
                    </div>
                </div>

                <MenuList
                    isMobileVersion={ props.isMobileVersion }
                    toggleFindUserMenuVisibility={ props.toggleFindUserMenuVisibility }/>
            </div>
            }
        </div>
    )
}

export default BurgerMenuMob