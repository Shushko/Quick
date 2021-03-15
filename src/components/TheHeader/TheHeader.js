import React from 'react';
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import classes from './TheHeader.module.sass';
import * as PropTypes from 'prop-types';
import { connect } from "react-redux";
import HeaderMenuContainer from "./HeaderMenu/HeaderMenuContainer";
import TheLogo from "../../common/TheLogo/TheLogo";
import { hideAllModalWindows, toggleMenuVisibility } from "../../redux/displayModalElements";
import arrow_back from '../../assets/arrow_back.png'
import InterlocutorInfo from "./InterlocutorInfo/InterlocutorInfo";

const TheHeader = ({ modalWindowsState, hideAllModalWindows, toggleMenuVisibility, ...props }) => {

    const dialogsListIsVisible = !props.match.params.dialogId;

    const handleClickBack = () => {
        const submenuIsOpen = modalWindowsState.findUserMenuIsVisible || modalWindowsState.photoEditorIsVisible;
        if (submenuIsOpen) {
            hideAllModalWindows();
            toggleMenuVisibility(true, false, 'Menu')
        } else if (modalWindowsState.menuIsVisible) {
            toggleMenuVisibility(false, false, '')
        } else {
            props.history.push('/');
        }
    };

    return (
        <header className={ classes.header }>

            { !props.isMobileVersion &&
            <>

                <div className={ classes.left_section }>
                    <HeaderMenuContainer/>
                    <div className={ classes.logo }><TheLogo/></div>
                </div>

                <div className={ classes.right_section }>
                    { props.match.params.dialogId && <InterlocutorInfo/> }
                </div>

            </> }

            { props.isMobileVersion &&
            <>
                { (!dialogsListIsVisible || modalWindowsState.activeTitle) &&
                <div className={ classes.arrow_back } onClick={ handleClickBack }>
                    <img src={ arrow_back } alt="Back"/>
                </div> }

                <div className={ classes.title }>
                    { modalWindowsState.activeTitle ?
                        <div>{ modalWindowsState.activeTitle }</div> :
                        <div>
                            { dialogsListIsVisible && <div className={ classes.before_logo }/> }
                            { props.match.params.dialogId ? <InterlocutorInfo /> : <TheLogo /> }
                        </div> }
                </div>
                <HeaderMenuContainer/>
            </> }
        </header>
    )
};

const mapStateToProps = (state) => ({
    isMobileVersion: state.appState.isMobileVersion,
    modalWindowsState: state.displayModalElements
});

const mapDispatchToProps = (dispatch) => ({
    hideAllModalWindows: () => dispatch(hideAllModalWindows()),
    toggleMenuVisibility: (menuIsVisible, darkBackgroundIsVisible, activeTitle) => {
        dispatch(toggleMenuVisibility(menuIsVisible, darkBackgroundIsVisible, activeTitle))
    }
});

TheHeader.propTypes = {
    isMobileVersion: PropTypes.bool,
    modalWindowsState: PropTypes.object,
    toggleMenuVisibility: PropTypes.func,
    hideAllModalWindows: PropTypes.func
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(TheHeader)