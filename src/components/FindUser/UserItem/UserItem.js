import React from "react";
import classes from './UserItem.module.sass'

const UserItem = ({ user, addNewDialog }) => {
    return (
        <div className={ classes.user_container } onClick={ () => addNewDialog(user.id) }>
            <div>
                <img src={ user.avatar } className={ classes.user_avatar } alt="ava"/>
            </div>
            <div>
                <div className={ classes.user_name }>
                    { user.name }
                </div>
                <div className={ classes.user_phone_number }>
                    { user.phoneNumber }
                </div>
            </div>
        </div>
    )
}

export default UserItem