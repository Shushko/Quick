import React from "react";
import classes from './BurgerMenu.module.sass'
import * as PropTypes from 'prop-types';
import { connect } from "react-redux";
import defaultAvatar from '../../../assets/defaultAvatar/ava.jpg'
import button from '../../../assets/menu_button.png'
import exit from '../../../assets/exit.png'
import create from '../../../assets/create.png'
import { toggleElementVisibility } from "../../../redux/displayMenu";
import { logOutUser } from "../../../redux/dialogsData/dialogsDataActions";
import { setUserIsAuthorized } from "../../../redux/authUser";
import { withRouter } from "react-router-dom";
import { compose } from "redux";

const BurgerMenu = (props) => {

    const logOutUser = () => {
        localStorage.removeItem('userIsAuthorized')
        localStorage.removeItem('userId')
        props.toggleElementVisibility(false, false, false)
        props.logOutUser()
        props.setUserIsAuthorized(false)
        props.history.push(`/`)
    }

    return (
        <div className={ classes.menu_container }>
            <div
                onClick={ () => props.toggleElementVisibility(!props.menuIsVisible, false, !props.menuIsVisible) }
                className={ classes.menu_button }
            >
                <img src={ button } alt="Menu" />
            </div>

            { props.currentUser &&
            <div className={ props.menuIsVisible ? classes.menu_active : classes.menu }>
                <div className={ classes.header }>
                    <img src={ props.currentUser.avatar || defaultAvatar } alt="avatar"/>
                    <div className={ classes.profileInfo }>
                        <span className={ classes.user_name }>{ props.currentUser.name }</span>
                    </div>
                </div>

                <div className={ classes.menu_item } onClick={ () => props.toggleElementVisibility(false, true, true) }>
                    <img src={ create }/>
                    <span>Find User</span>
                </div>
                <div className={ classes.menu_item } onClick={ logOutUser }>
                    <img src={ exit }/>
                    <span>Log Out</span>
                </div>
            </div>
            }
        </div>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.dialogsDataReducer.currentUser,
    menuIsVisible: state.displayMenu.menuIsVisible,
    darkBackgroundIsVisible: state.displayMenu.darkBackgroundIsVisible
});

const mapDispatchToProps = (dispatch) => ({
    toggleElementVisibility: (menuIsVisible, findUserMenuIsVisible, darkBackgroundIsVisible) => {
        dispatch(toggleElementVisibility(menuIsVisible, findUserMenuIsVisible, darkBackgroundIsVisible))
    },
    setUserIsAuthorized: (value) => { dispatch(setUserIsAuthorized(value)) },
    logOutUser: () => dispatch(logOutUser())
});

BurgerMenu.propTypes = {
    currentUser: PropTypes.object,
    menuIsVisible: PropTypes.bool,
    darkBackgroundIsVisible: PropTypes.bool,
    toggleElementVisibility: PropTypes.func,
    setUserIsAuthorized: PropTypes.func,
    logOutUser: PropTypes.func,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(BurgerMenu)