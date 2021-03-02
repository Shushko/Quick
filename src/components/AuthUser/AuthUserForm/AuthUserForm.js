import React from "react";
import classes from "./AuthUserForm.module.sass";
import { mustBeNumber, mustBePhoneNumber, required } from "../../../common/Validators";
import * as PropTypes from 'prop-types';
import { CODE_FORM_TEXT, NUMBER_PHONE_FORM_TEXT } from "../../../common/Messages";
import InputForm from "../../../common/InputForm/InputForm";

const AuthUserForm = (props) => {

    const onSubmit = (formData) => { props.numberFormIsVisible ? props.authorizeUser(formData.authUser) : props.checkVerificationCode(formData.authUser) };

    return (
        <div>
            <span className={ classes.form_text }>
                { props.numberFormIsVisible ? NUMBER_PHONE_FORM_TEXT : CODE_FORM_TEXT }
            </span>

            <InputForm
                formType={ 'auth_user' }
                inputName={ 'authUser' }
                onSubmit={ onSubmit }
                isInvalidNumber={ props.isInvalidNumber }
                numberFormIsVisible={ props.numberFormIsVisible }
                validators={ props.numberFormIsVisible ? [required, mustBePhoneNumber] : [required, mustBeNumber] }
                placeholder={ props.numberFormIsVisible ? "+380XXXXXXXXX" : "Code" }
            />
        </div>
    )
};

AuthUserForm.propTypes = {
    numberFormIsVisible: PropTypes.bool,
    authorizeUser: PropTypes.func,
    checkVerificationCode: PropTypes.func,
    isInvalidNumber: PropTypes.bool
};

export default AuthUserForm