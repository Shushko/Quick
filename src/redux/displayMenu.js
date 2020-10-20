const TOGGLE_MENU_IS_VISIBLE = 'TOGGLE_MENU_IS_VISIBLE'

const init = {
    menuIsVisible: false
}

const displayMenu = (state = init, action) => {
    switch (action.type) {

        case 'TOGGLE_MENU_IS_VISIBLE':
            return {
                ...state,
                menuIsVisible: action.value
            }

        default:
            return state

    }
}

export const toggleMenuIsVisible = (value) => ({
    type: TOGGLE_MENU_IS_VISIBLE,
    value
})

export default displayMenu