import { searchByPhoneNumber } from "../api/api";

const ADD_FOUND_USERS = 'ADD_FOUND_USERS'

const init = {
    foundUsers: []
}

const findUsers = (state = init, action) => {
    switch (action.type) {

        case 'ADD_FOUND_USERS':
            return {
                ...state,
                foundUsers: action.foundUsers
            }

        default:
            return state
    }
}

export const addFoundUsers = (foundUsers) => ({
    type: ADD_FOUND_USERS,
    foundUsers
})

export const searchUsers = (value) => {
    return (dispatch) => {
        searchByPhoneNumber(value)
            .then(data =>  {
                if (data.val()) {
                    const foundUsers = Object.values(data.val())
                    dispatch(addFoundUsers(foundUsers))
                } else { dispatch(addFoundUsers([])) }
            })
    }
}

export default findUsers