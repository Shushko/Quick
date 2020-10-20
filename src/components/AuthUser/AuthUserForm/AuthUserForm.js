import React from "react";
import classes from "./AuthUserForm.module.sass";

const AuthUserForm = (props) => {

    const changeInputValue = (e) => props.changeInputValue(e.currentTarget.value)

    return (
        <div>
            { props.numberFormIsVisible ?
                <div>
                    <span>Please, enter your full phone number.</span>
                    <div className={ classes.form_container }>
                        <textarea onChange={ changeInputValue } value={props.inputBody} placeholder="Phone number" />
                        <button className={ classes.button_send } onClick={ props.authorizeUser }>Send
                        </button>
                    </div>
                </div>
                :
                <div>
                    <span>Please, enter your verification code.</span>
                    <div className={ classes.form_container }>
                        <textarea onChange={ changeInputValue } value={props.inputBody} placeholder="Code" />
                        <button className={ classes.button_send }
                                onClick={ props.checkVerificationCode }>Send
                        </button>
                    </div>
                </div> }
        </div>
    )
}

export default AuthUserForm