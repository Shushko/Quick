import React from 'react';
import './App.sass';
import TheHeader from "./components/Header/TheHeader";
import ChatSection from "./components/ChatSection/ChatSection";
import UserDialogsContainer from "./components/DialogsSection/UserDialogsContainer";
import AuthUser from "./components/AuthUser/AuthUser";
import { connect } from "react-redux";
import { setAuthorizedUser } from "./redux/authUser/authUserActions";
import { toggleDarkBackgroundIsVisible, toggleFindUserMenuIsVisible, toggleMenuIsVisible } from "./redux/displayMenu";
import FindUser from "./components/Header/BurgerMenu/FindUser/FindUser";

class App extends React.Component {
    componentDidMount() {
        const userIsAuthorized = localStorage.getItem('userIsAuthorized')
        userIsAuthorized ? this.props.setAuthorizedUser(true) : this.props.setAuthorizedUser(false)
    }

    render() {
        return (
            <div className="app_container">
                <div
                    className={ this.props.displayMenu.darkBackgroundIsVisible ? "bg_menu_active" : "bg_menu" }
                    onClick={ () => {
                        this.props.toggleMenuIsVisible(false)
                        this.props.toggleFindUserMenuIsVisible(false)
                        this.props.toggleDarkBackgroundIsVisible(false)
                    } }
                />

                { this.props.displayMenu.findUserMenuIsVisible ? <FindUser /> : '' }

                { this.props.userIsAuthorized ?
                    <div className="app_wrapper">

                        <TheHeader/>
                        <div className="main_content">
                            <UserDialogsContainer/>
                            <ChatSection/>
                        </div>

                    </div> :

                    <AuthUser/> }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    userIsAuthorized: state.authUserReducer.userIsAuthorized,
    displayMenu: state.displayMenu
})

const mapDispatchToProps = (dispatch) => ({
    setAuthorizedUser: (value) => { dispatch(setAuthorizedUser(value)) },
    toggleMenuIsVisible: (value) => { dispatch(toggleMenuIsVisible(value)) },
    toggleFindUserMenuIsVisible: (value) => { dispatch(toggleFindUserMenuIsVisible(value)) },
    toggleDarkBackgroundIsVisible: (value) => { dispatch(toggleDarkBackgroundIsVisible(value)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
