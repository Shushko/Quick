const IS_NEW_USER_MESSAGE = 'IS_NEW_USER_MESSAGE';

const init = {
    isNewUserMessage: false
}

const sendNewMessage = (state = init, action) => {
    switch (action.type) {

        case 'IS_NEW_USER_MESSAGE':
            return {
                ...state,
                isNewUserMessage: action.value
            };

        default:
            return state

    }
}

export const setIsNewUserMessage = (value) => ({
    type: IS_NEW_USER_MESSAGE,
    value
})

export default sendNewMessage