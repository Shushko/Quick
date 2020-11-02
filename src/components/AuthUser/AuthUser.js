import React from "react";
import classes from './AuthUser.module.sass'
import * as firebase from "firebase";
import { connect } from "react-redux";
import AuthUserForm from "./AuthUserForm/AuthUserForm";
import Preloader from "../../common/Preloader/Preloader";
import { setAuthorizedUser } from "../../redux/authUser/authUserActions";

class AuthUser extends React.Component {
    state = {
        preloaderIsVisible: false,
        numberFormIsVisible: false,
        verificationCodeFormIsVisible: false,
        signInIsVisible: true,
        phoneNumber: '',
        isInvalidNumber: false
    }

    constructor (props) {
        super(props)
        this.grit = "Hi! It's cool that you are with us. Enjoy comfortable communication!"
        this.verificationCodeText = "We have sent a verification code on your device. Please, enter your code below."
        this.confirmationResult = null
        this.recaptcha = null
    }

    authorizeUser = async (value) => {
        this.setState({ preloaderIsVisible: true, isInvalidNumber: false })
        if (!this.recaptcha) {
            this.recaptcha = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                size: "invisible"
            })
        }

        try {
            this.confirmationResult = await firebase.auth().signInWithPhoneNumber(value.trim(), this.recaptcha)
            this.setState({
                phoneNumber: value,
                numberFormIsVisible: false,
                verificationCodeFormIsVisible: true
            })
        } catch (error) {
            this.setState({
                isInvalidNumber: true,
                phoneNumber: '',
                numberFormIsVisible: true,
                verificationCodeFormIsVisible: false
            })
            console.log(error)
        } finally {
            this.setState({ preloaderIsVisible: false })
        }
    }

    checkVerificationCode = async (value) => {
        this.setState({ preloaderIsVisible: true, isInvalidNumber: false })
        try {
            const resultUser = await this.confirmationResult.confirm(value.trim())

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
            this.props.setAuthorizedUser(true)
            this.setState({ signInIsVisible: true, verificationCodeFormIsVisible: false })
        } catch (error) {
            this.setState({ isInvalidNumber: true })
            console.log(error)
        } finally {
            this.setState({ preloaderIsVisible: false })
        }
    }

    render() {
        return (
            <div className={ classes.authorization_wrapper }>
                <div className={ classes.authorization_content }>
                    <div className={ classes.logo }>
                        <div className={ classes.logo_text }>MyMessenger</div>
                    </div>
                    <div className={ classes.auth_form_text }>
                        { this.state.signInIsVisible &&
                        <span className={ classes.auth_form_text_grit }>
                            { this.grit }
                        </span> }

                        { this.state.verificationCodeFormIsVisible &&
                        <div>
                            <div className={ classes.auth_form_text_phone_number }>
                                <span>{ this.state.phoneNumber }</span>
                                <button
                                    className={ classes.button_edit_number }
                                    onClick={ () => this.setState({
                                        numberFormIsVisible: true,
                                        verificationCodeFormIsVisible: false,
                                        isInvalidNumber: false
                                    }) }
                                >
                                    Edit phone number
                                </button>
                            </div>

                            <div>
                                <span className={ classes.auth_form_text_grit }>{ this.verificationCodeText }</span>
                            </div>
                        </div>
                        }

                        <div className={ classes.auth_form_sign_in }>
                            { this.state.signInIsVisible ?
                                <button
                                    onClick={ () => this.setState({ signInIsVisible: false, numberFormIsVisible: true }) }
                                    className={ classes.button_sign_in }
                                >
                                    Sign In
                                </button> :
                                <div>
                                    { this.state.preloaderIsVisible ? <Preloader/> :
                                        <AuthUserForm
                                            numberFormIsVisible={ this.state.numberFormIsVisible }
                                            authorizeUser={ this.authorizeUser }
                                            checkVerificationCode={ this.checkVerificationCode }
                                            isInvalidNumber={ this.state.isInvalidNumber }
                                        /> }
                                </div> }
                        </div>
                        <div id='recaptcha-container'/>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    setAuthorizedUser: (value) => { dispatch(setAuthorizedUser(value)) }
})

export default connect(null, mapDispatchToProps)(AuthUser)