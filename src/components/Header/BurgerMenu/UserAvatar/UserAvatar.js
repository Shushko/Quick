import React from "react";
import classes from './UserAvatar.module.sass'
import defaultAvatar from '../../../../assets/defaultAvatar/ava.jpg'
import camera from "../../../../assets/camera.png";

const UserAvatar = (props) => {
    return (
        <>
            <img src={ props.currentUser.avatar || defaultAvatar } className={ classes.avatar } alt="avatar"/>
            <div className={ classes.select_photo }
                 onClick={ () => props.togglePhotoEditorVisibility(false, true, !props.isMobileVersion, 'Avatar editor') }>
                <img src={ camera } alt="camera"/>
            </div>
        </>
    )
}

export default UserAvatar