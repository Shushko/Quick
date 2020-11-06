import React from "react";
import classes from './AuthUser.module.sass'
import * as firebase from "firebase";
import { connect } from "react-redux";
import AuthUserForm from "./AuthUserForm/AuthUserForm";
import Preloader from "../../common/Preloader/Preloader";
import { setAuthorizedUser } from "../../redux/authUser/authUserActions";
import { AUTH_FORM_GRIT, VERIFICATION_CODE_TEXT } from "../../common/Messages";

class AuthUser extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            preloaderIsVisible: false,
            numberFormIsVisible: false,
            verificationCodeFormIsVisible: false,
            signInIsVisible: true,
            phoneNumber: '',
            isInvalidNumber: false,
            confirmationResult: null,
            recaptcha: null
        }
    }

    authorizeUser = async (value) => {
        this.setState({ preloaderIsVisible: true, isInvalidNumber: false })
        if (!this.state.recaptcha) {
            this.state.recaptcha = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                size: "invisible"
            })
        }

        try {
            const result = await firebase.auth().signInWithPhoneNumber(value.trim(), this.state.recaptcha)
            this.setState({
                confirmationResult: result,
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
        } finally {
            this.setState({ preloaderIsVisible: false })
        }
    }

    checkVerificationCode = async (value) => {
        this.setState({ preloaderIsVisible: true, isInvalidNumber: false })
        try {
            const resultUser = await this.state.confirmationResult.confirm(value.trim())

            if (resultUser.additionalUserInfo.isNewUser) {
                getUser(resultUser.user.uid).set({
                    id: resultUser.user.uid,
                    name: resultUser.user.phoneNumber,
                    phoneNumber: resultUser.user.phoneNumber,
                    avatar: 'https://www.allthetests.com/quiz22/picture/pic_1171831236_1.png'
                })
            }

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

    editNumberForm = () => {
        this.setState({
            numberFormIsVisible: true,
            verificationCodeFormIsVisible: false,
            isInvalidNumber: false
        })
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
                            { AUTH_FORM_GRIT }
                        </span> }

                        { this.state.verificationCodeFormIsVisible &&
                        <div>
                            <div className={ classes.auth_form_text_phone_number }>
                                <span>{ this.state.phoneNumber }</span>
                                <button
                                    className={ classes.button_edit_number }
                                    onClick={ this.editNumberForm }
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

export default connect(null, mapDispatchToProps)(AuthUser)