const init = {
    userIsAuthorized: false
}

const authUserReducer = (state = init, action) => {
    switch (action.type) {

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