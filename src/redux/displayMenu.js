const TOGGLE_MENU_IS_VISIBLE = 'TOGGLE_MENU_IS_VISIBLE'
const TOGGLE_FIND_USER_MENU_IS_VISIBLE = 'TOGGLE_FIND_USER_MENU_IS_VISIBLE'
const DARK_BACKGROUND_IS_VISIBLE = 'DARK_BACKGROUND_IS_VISIBLE'

const init = {
    menuIsVisible: false,
    findUserMenuIsVisible: false,
    darkBackgroundIsVisible: false
}

const displayMenu = (state = init, action) => {
    switch (action.type) {

        case 'TOGGLE_MENU_IS_VISIBLE':
            return {
                ...state,
                menuIsVisible: action.value
            }

        case 'TOGGLE_FIND_USER_MENU_IS_VISIBLE':
            return {
                ...state,
                findUserMenuIsVisible: action.value
            }

        case 'DARK_BACKGROUND_IS_VISIBLE':
            return {
                ...state,
                darkBackgroundIsVisible: action.value
            }

        default:
            return state

    }
}

export const toggleMenuIsVisible = (value) => ({
    type: TOGGLE_MENU_IS_VISIBLE,
    value
})

export const toggleFindUserMenuIsVisible = (value) => ({
    type: TOGGLE_FIND_USER_MENU_IS_VISIBLE,
    value
})

export const toggleDarkBackgroundIsVisible = (value) => ({
    type: DARK_BACKGROUND_IS_VISIBLE,
    value
})

export default displayMenu