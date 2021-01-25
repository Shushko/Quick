import React from 'react';
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import classes from './TheHeader.module.sass';
import * as PropTypes from 'prop-types';
import { connect } from "react-redux";
import HeaderMenuContainer from "./HeaderMenu/HeaderMenuContainer";
import TheLogo from "../../common/TheLogo/TheLogo";
import { toggleDialogsListIsVisible } from "../../redux/dialogsData/dialogsDataActions";
import { hideAllModalWindows, toggleMenuVisibility } from "../../redux/displayModalElements";
import arrow_back from '../../assets/arrow_back.png'

const TheHeader = ({ dialogsListIsVisible, toggleDialogsListIsVisible, modalWindowsState, hideAllModalWindows, toggleMenuVisibility, ...props }) => {

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
            <HeaderMenuContainer/>
            { !props.isMobileVersion && <div className={ classes.header_logo }><TheLogo /></div> }

            { props.isMobileVersion &&
            <>
                { (!dialogsListIsVisible || modalWindowsState.activeTitle) &&
                <div className={ classes.arrow_back } onClick={ handleClickBack }>
                    <img src={ arrow_back } alt="Back"/>
                </div> }

                <div className={ classes.header_title }>
                    { modalWindowsState.activeTitle ?
                        <div>{ modalWindowsState.activeTitle }</div> :
                        <div>
                            { dialogsListIsVisible && <div className={ classes.before_logo }/> }
                            <TheLogo />
                        </div> }
                </div>
            </> }
        </header>
    )
};

const mapStateToProps = (state) => ({
    isMobileVersion: state.appState.isMobileVersion,
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

TheHeader.propTypes = {
    isMobileVersion: PropTypes.bool,
    dialogsListIsVisible: PropTypes.bool,
    modalWindowsState: PropTypes.object,
    toggleDialogsListIsVisible: PropTypes.func,
    toggleMenuVisibility: PropTypes.func,
    hideAllModalWindows: PropTypes.func
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(TheHeader)