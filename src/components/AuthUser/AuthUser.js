import React from "react";
import classes from './AuthUser.module.sass'
import * as firebase from "firebase";
import { connect } from "react-redux";
import AuthUserForm from "./AuthUserForm/AuthUserForm";
import Preloader from "../../common/Preloader/Preloader";
import {
    changeInputValue,
    checkVerificationCode, setAuthorizedUser,
    toggleNumberForm, togglePreloader,
    toggleSignIn
} from "../../redux/authUser/authUserActions";

const AuthUser = (props) => {

    const authorizeUser = async () => {
        props.togglePreloader(true)
        props.toggleNumberForm(false)
        const recaptcha = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            size: "invisible"
        })

        try {
            window.confirmationResult = await firebase.auth().signInWithPhoneNumber(props.inputBody, recaptcha)
            props.changeInputValue('')
            props.togglePreloader(false)
        } catch (error) {
            console.log(error)
        }
    }

    const checkVerificationCode = async () => {
        props.togglePreloader(true)
        try {
            const resultUser = await window.confirmationResult.confirm(props.inputBody)
            props.changeInputValue('')
            props.togglePreloader(false)

            firebase.database().ref(`/users/${resultUser.user.uid}`).on('value', elem => {
                if (!elem.val()) {
                    firebase.database().ref(`/users/${resultUser.user.uid}`).set({
                        id: resultUser.user.uid,
                        name: 'TEST',
                        avatar: null,
                        currentDialogs: {
                            test: 'test'
                        }
                    })
                }
            })

            localStorage.setItem('userId', resultUser.user.uid)
            localStorage.setItem('userIsAuthorized', 'true')
            props.setAuthorizedUser(true)
            props.toggleSignIn(true)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={ classes.authorization_wrapper }>
            <div className={ classes.authorization_content }>
                <div className={ classes.logo }>
                    <div className={ classes.logo_text }>MyMessenger</div>
                </div>
                <div className={ classes.auth_form_text }>
                    <span className={ classes.auth_form_text_grit }>Hi! It's cool that you are with us. Enjoy comfortable communication!</span>

                    <div className={ classes.auth_form_sign_in }>
                        { props.signInIsVisible ?
                            <button
                                onClick={ () => {
                                    props.toggleSignIn(false)
                                    props.toggleNumberForm(true)
                                } }
                                className={ classes.button_sign_in }
                            >
                                Sign In
                            </button> :
                            <div>
                                { props.preloaderIsVisible ? <Preloader/> :
                                    <AuthUserForm
                                        inputBody={ props.inputBody }
                                        numberFormIsVisible={ props.numberFormIsVisible }
                                        authorizeUser={ authorizeUser }
                                        checkVerificationCode={ checkVerificationCode }
                                        changeInputValue={ props.changeInputValue }
                                    /> }
                            </div> }
                    </div>
                    <div id='recaptcha-container'/>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    signInIsVisible: state.authUserReducer.signInIsVisible,
    numberFormIsVisible: state.authUserReducer.numberFormIsVisible,
    verificationCodeEntered: state.authUserReducer.verificationCodeEntered,
    inputBody: state.authUserReducer.inputBody,
    preloaderIsVisible: state.authUserReducer.preloaderIsVisible
})

const mapDispatchToProps = (dispatch) => ({
    toggleSignIn: (value) => { dispatch(toggleSignIn(value)) },
    toggleNumberForm: (value) => { dispatch(toggleNumberForm(value)) },
    checkVerificationCode: (value) => { dispatch(checkVerificationCode(value)) },
    changeInputValue: (value) => { dispatch(changeInputValue(value)) },
    togglePreloader: (value) => { dispatch(togglePreloader(value)) },
    setAuthorizedUser: (value) => { dispatch(setAuthorizedUser(value)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthUser)