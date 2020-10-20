const SET_CURRENT_USER = 'SET_CURRENT_USER'

const init = {
    currentUser: null
}

const currentUser = (state = init, action) => {
    switch (action.type) {

        case 'SET_CURRENT_USER':
            return {
                ...state,
                currentUser: action.currentUser
            }

        default:
            return state

    }
}

export const setCurrentUserAction = (data) => ({
    type: SET_CURRENT_USER,
    currentUser: data
})

export default currentUser