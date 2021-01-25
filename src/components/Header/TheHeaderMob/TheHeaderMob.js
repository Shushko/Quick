import React from 'react';
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import classes from './TheHeaderMob.module.sass';
import * as PropTypes from 'prop-types';
import { connect } from "react-redux";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import arrow_back from '../../../assets/arrow_back.png'
import TheLogo from "../../../common/TheLogo/TheLogo";
import { toggleDialogsListIsVisible } from "../../../redux/dialogsData/dialogsDataActions";
import { hideAllModalWindows, toggleMenuVisibility } from "../../../redux/displayModalElements";

const TheHeaderMob = ({ dialogsListIsVisible, toggleDialogsListIsVisible, modalWindowsState, hideAllModalWindows, toggleMenuVisibility, ...props }) => {

    const handleClickBack = () => {
        const submenuIsOpen = modalWindowsState.findUserMenuIsVisible || modalWindowsState.photoEditorIsVisible;
        if (submenuIsOpen) {
            hideAllModalWindows();
            toggleMenuVisibility(true, false, 'Menu')
        } else if (modalWindowsState.menuIsVisible) {
            toggleMenuVisibility(false, false, '')
        } else {
            props.history.push('/');
            !dialogsListIsVisible && toggleDialogsListIsVisible(true)
        }
    };

    return (
        <header className={ classes.header }>

            { (!dialogsListIsVisible || modalWindowsState.activeTitle) &&
            <div className={ classes.arrow_back } onClick={ handleClickBack }>
                <img src={ arrow_back } alt="Back"/>
            </div> }

            <div className={ classes.header_title }>
                { modalWindowsState.activeTitle ? <div>{ modalWindowsState.activeTitle }</div> : <TheLogo /> }
            </div>

            <BurgerMenu />

        </header>
    )
};

const mapStateToProps = (state) => ({
    dialogsListIsVisible: state.dialogsDataReducer.dialogsListIsVisible,
    modalWindowsState: state.displayModalElements
});

const mapDispatchToProps = (dispatch) => ({
    toggleDialogsListIsVisible: (value) => dispatch(toggleDialogsListIsVisible(value)),
    hideAllModalWindows: () => dispatch(hideAllModalWindows()),
    toggleMenuVisibility: (menuIsVisible, darkBackgroundIsVisible, activeTitle) => {
        dispatch(toggleMenuVisibility(menuIsVisible, darkBackgroundIsVisible, activeTitle))
    }
});

TheHeaderMob.propTypes = {
    dialogsListIsVisible: PropTypes.bool,
    modalWindowsState: PropTypes.object,
    toggleDialogsListIsVisible: PropTypes.func,
    toggleMenuVisibility: PropTypes.func,
    hideAllModalWindows: PropTypes.func
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(TheHeaderMob)