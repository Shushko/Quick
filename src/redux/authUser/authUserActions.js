const TOGGLE_SIGN_IN = 'TOGGLE_SIGN_IN'
const TOGGLE_NUMBER_FORM = 'TOGGLE_NUMBER_FORM'
const CHECK_VERIFICATION_CODE = 'CHECK_VERIFICATION_CODE'
const CHANGE_INPUT_BODY = 'CHANGE_INPUT_BODY'
const TOGGLE_PRELOADER = 'TOGGLE_PRELOADER'
const SET_AUTHORIZED_USER = 'SET_AUTHORIZED_USER'

export const toggleSignIn = (value) => ({
    type: TOGGLE_SIGN_IN,
    value
})

export const toggleNumberForm = (value) => ({
    type: TOGGLE_NUMBER_FORM,
    value
})

export const checkVerificationCode = (value) => ({
    type: CHECK_VERIFICATION_CODE,
    value
})

export const changeInputValue = (value) => ({
    type: CHANGE_INPUT_BODY,
    value
})

export const togglePreloader = (value) => ({
    type: TOGGLE_PRELOADER,
    value
})

export const setAuthorizedUser = (value) => ({
    type: SET_AUTHORIZED_USER,
    value
})
