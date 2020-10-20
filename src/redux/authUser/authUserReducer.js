const init = {
    userIsAuthorized: false,
    inputBody: '',
    signInIsVisible: true,
    numberFormIsVisible: false,
    verificationCodeEntered: false,
    preloaderIsVisible: false
}

const authUserReducer = (state = init, action) => {
    switch (action.type) {

        case 'TOGGLE_SIGN_IN':
            return {
                ...state,
                signInIsVisible: action.value
            }

        case 'TOGGLE_NUMBER_FORM':
            return {
                ...state,
                numberFormIsVisible: action.value
            }

        case 'CHECK_VERIFICATION_CODE':
            return {
                ...state,
                verificationCodeEntered: action.value
            }

        case 'CHANGE_INPUT_BODY':
            return {
                ...state,
                inputBody: action.value
            }

        case 'TOGGLE_PRELOADER':
            return {
                ...state,
                preloaderIsVisible: action.value
            }

        case 'SET_AUTHORIZED_USER':
            return {
                ...state,
                userIsAuthorized: action.value
            }

        default:
            return state

    }
}

export default authUserReducer