import { setUser } from "../api/api";

const SET_AUTHORIZED_USER = 'SET_AUTHORIZED_USER';

const init = {
    userIsAuthorized: localStorage.getItem('userIsAuthorized')
};

const authUser = (state = init, action) => {
    switch (action.type) {

        case 'SET_AUTHORIZED_USER':
            return {
                ...state,
                userIsAuthorized: action.value
            };

        default:
            return state
    }
};

export const setUserIsAuthorized = (value) => ({
    type: SET_AUTHORIZED_USER,
    value
});

export const setAuthorizedUser = (isNewUser, userId, userPhoneNumber) => (dispatch) => {
    isNewUser && setUser(userId, userPhoneNumber);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userIsAuthorized', 'true');
    dispatch(setUserIsAuthorized(true));
};

export default authUser