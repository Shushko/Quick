import React, { useState } from "react";
import classes from './AuthUser.module.sass';
import * as PropTypes from 'prop-types';
import * as firebase from "firebase";
import { connect } from "react-redux";
import AuthUserForm from "./AuthUserForm/AuthUserForm";
import Preloader from "../../common/Preloader/Preloader";
import { setAuthorizedUser } from "../../redux/authUser";
import { AUTH_FORM_GRIT, VERIFICATION_CODE_TEXT } from "../../common/Messages";
import TheLogo from "../../common/TheLogo/TheLogo";


const AuthUser = (props) => {
    const [preloaderIsVisible, setPreloaderIsVisible] = useState(false);
    const [numberFormIsVisible, setNumberFormIsVisible] = useState(false);
    const [verificationCodeFormIsVisible, setVerificationCodeFormIsVisible] = useState(false);
    const [signInIsVisible, setSignInIsVisible] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isInvalidNumber, setIsInvalidNumber] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [recaptcha, setRecaptcha] = useState(null);

    const authorizeUser = async (value) => {
        setPreloaderIsVisible(true);
        setIsInvalidNumber(false);
        let rec = null;
        if (!recaptcha) {
            rec = await new firebase.auth.RecaptchaVerifier('recaptcha-container', { size: "invisible" });
            setRecaptcha(rec);
        }

        try {
            const result = await firebase.auth().signInWithPhoneNumber(value.trim(), rec || recaptcha);

            setConfirmationResult(result);
            setPhoneNumber(value);
            setNumberFormIsVisible(false);
            setVerificationCodeFormIsVisible(true);

        } catch (e) {
            setIsInvalidNumber(true);
            setPhoneNumber('');
            setNumberFormIsVisible(true);
            setVerificationCodeFormIsVisible(false)
        } finally {
            setPreloaderIsVisible(false);
        }
    };

    const checkVerificationCode = async (value) => {
        setPreloaderIsVisible(true);
        setIsInvalidNumber(false);
        try {
            const resultUser = await confirmationResult.confirm(value.trim());
            setSignInIsVisible(true);
            setVerificationCodeFormIsVisible(false);
            props.setAuthorizedUser(resultUser.additionalUserInfo.isNewUser, resultUser.user.uid, resultUser.user.phoneNumber)
        } catch (e) {
            setIsInvalidNumber(true);
            setPreloaderIsVisible(false);
        }
    };

    const editNumberForm = () => {
        setNumberFormIsVisible(true);
        setVerificationCodeFormIsVisible(false);
        setIsInvalidNumber(false);
    };

        return (
            <div className={ classes.authorization_wrapper }>
                <div className={ classes.authorization_content }>
                    <div className={ classes.content_header }>
                        <TheLogo />
                    </div>

                    <div className={ classes.auth_form_text }>
                        { signInIsVisible &&
                        <span className={ classes.auth_form_text_grit }>
                            { AUTH_FORM_GRIT }
                        </span> }

                        { verificationCodeFormIsVisible &&
                        <div>
                            <div className={ classes.auth_form_text_phone_number }>
                                <span>{ phoneNumber }</span>
                                <button
                                    className={ classes.button_edit_number }
                                    onClick={ editNumberForm }
                                >
                                    Edit phone number
                                </button>
                            </div>

                            <div>
                                <span className={ classes.auth_form_text_grit }>{ VERIFICATION_CODE_TEXT }</span>
                            </div>
                        </div>
                        }

                        <div className={ classes.auth_form_sign_in }>
                            { signInIsVisible ?
                                <button
                                    onClick={ () => {
                                        setSignInIsVisible(false);
                                        setNumberFormIsVisible(true);
                                    } }
                                    className={ classes.button_sign_in }
                                >
                                    Sign In
                                </button> :
                                <div>
                                    { preloaderIsVisible ? <Preloader type={ 'default' }/> :
                                        <AuthUserForm
                                            numberFormIsVisible={ numberFormIsVisible }
                                            authorizeUser={ authorizeUser }
                                            checkVerificationCode={ checkVerificationCode }
                                            isInvalidNumber={ isInvalidNumber }
                                        /> }
                                </div> }
                        </div>
                        <div id='recaptcha-container'/>
                    </div>
                </div>
            </div>
        )
    };

const mapDispatchToProps = (dispatch) => ({
    setAuthorizedUser: (isNewUser, userId, userPhoneNumber) => dispatch(setAuthorizedUser(isNewUser, userId, userPhoneNumber))
});

AuthUser.propTypes = {
    setAuthorizedUser: PropTypes.func
};

export default connect(null, mapDispatchToProps)(AuthUser)