const TOGGLE_ELEMENT_VISIBILITY = 'TOGGLE_ELEMENT_VISIBILITY'

const init = {
    menuIsVisible: false,
    findUserMenuIsVisible: false,
    darkBackgroundIsVisible: false
}

const displayMenu = (state = init, action) => {
    switch (action.type) {

        case 'TOGGLE_ELEMENT_VISIBILITY':
            return {
                ...state,
                menuIsVisible: action.menuIsVisible,
                findUserMenuIsVisible: action.findUserMenuIsVisible,
                darkBackgroundIsVisible: action.darkBackgroundIsVisible
            }

        default:
            return state

    }
}

export const toggleElementVisibility = (menuIsVisible, findUserMenuIsVisible, darkBackgroundIsVisible) => ({
    type: TOGGLE_ELEMENT_VISIBILITY,
    menuIsVisible,
    findUserMenuIsVisible,
    darkBackgroundIsVisible
})

export default displayMenu