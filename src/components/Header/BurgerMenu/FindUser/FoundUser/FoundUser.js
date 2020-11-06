import React from "react";
import classes from './FoundUser.module.sass'

const FoundUser = (props) => {
    const user = props.user
    return (
        <div className={ classes.user_container } onClick={ () => props.addNewDialog(user.id) }>
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

export default FoundUser