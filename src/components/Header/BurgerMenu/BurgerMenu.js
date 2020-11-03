import React from "react";
import classes from './BurgerMenu.module.sass'
import { connect } from "react-redux";
import ava from '../../../assets/defaultAvatar/ava.jpg'
import button from '../../../assets/menu_button.png'
import exit from '../../../assets/exit.png'
import create from '../../../assets/create.png'
import {
    toggleDarkBackgroundIsVisible,
    toggleFindUserMenuIsVisible,
    toggleMenuIsVisible
} from "../../../redux/displayMenu";
import { clearDialogs, setCurrentUser } from "../../../redux/dialogsData/dialogsDataActions";
import { setAuthorizedUser } from "../../../redux/authUser/authUserActions";
import { Redirect } from "react-router-dom";

class BurgerMenu extends React.Component {

    logOutUser = () => {
        localStorage.removeItem('userIsAuthorized')
        localStorage.removeItem('userId')
        this.props.setAuthorizedUser(false)
        this.props.toggleMenuIsVisible(false)
        this.props.clearDialogs()
        this.props.setCurrentUser(null)
        return <Redirect to='/' />
    }

    render() {
        return (
            <div className={ classes.menu_container }>
                <div onClick={ this.props.menuIsVisible === false ?
                    () => {
                    this.props.toggleDarkBackgroundIsVisible(true)
                    this.props.toggleMenuIsVisible(true)
                } :
                    () => {
                    this.props.toggleDarkBackgroundIsVisible(false)
                    this.props.toggleMenuIsVisible(false)
                } }
                     className={ classes.menu_button }
                >
                    <img src={ button }/>
                </div>

                { !this.props.currentUser ? null :
                    <div className={ this.props.menuIsVisible ? classes.menu_active : classes.menu }>
                        <div className={ classes.header }>
                            <img src={ this.props.currentUser.avatar ? this.props.currentUser.avatar : ava }
                                 alt="avatar"/>
                            <div className={ classes.profileInfo }>
                                <span className={ classes.user_name }>{ this.props.currentUser.name }</span>
                            </div>
                        </div>

                        <div className={ classes.menu_item } onClick={ () => {
                            this.props.toggleMenuIsVisible(false)
                            this.props.toggleFindUserMenuIsVisible(true)
                        } }>
                            <img src={ create }/>
                            <span>Create chat</span>
                        </div>
                        <div className={ classes.menu_item } onClick={ this.logOutUser }>
                            <img src={ exit }/>
                            <span>Log Out</span>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.dialogsDataReducer.currentUser,
    menuIsVisible: state.displayMenu.menuIsVisible,
    darkBackgroundIsVisible: state.displayMenu.darkBackgroundIsVisible
})

const mapDispatchToProps = (dispatch) => ({
    setAuthorizedUser: (value) => { dispatch(setAuthorizedUser(value)) },
    toggleMenuIsVisible: (value) => { dispatch(toggleMenuIsVisible(value)) },
    toggleFindUserMenuIsVisible: (value) => { dispatch(toggleFindUserMenuIsVisible(value)) },
    toggleDarkBackgroundIsVisible: (value) => { dispatch(toggleDarkBackgroundIsVisible(value)) },
    clearDialogs: () => { dispatch(clearDialogs()) },
    setCurrentUser: (data) => { dispatch(setCurrentUser(data)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(BurgerMenu)