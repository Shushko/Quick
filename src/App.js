import React from 'react';
import './App.sass';
import TheHeader from "./components/Header/TheHeader";
import ChatSection from "./components/ChatSection/ChatSection";
import UserDialogsContainer from "./components/DialogsSection/UserDialogsContainer";
import AuthUser from "./components/AuthUser/AuthUser";
import { connect } from "react-redux";
import { setAuthorizedUser } from "./redux/authUser/authUserActions";
import { toggleMenuIsVisible } from "./redux/displayMenu";

class App extends React.Component {
    componentDidMount() {
        const userIsAuthorized = localStorage.getItem('userIsAuthorized')
        userIsAuthorized ? this.props.setAuthorizedUser(true) : this.props.setAuthorizedUser(false)
    }

    render() {
        return (
            <div className="app_container">
                { this.props.userIsAuthorized ?
                    <div className="app_wrapper">

                        <div className={ this.props.menuIsVisible ? "bg_menu_active" : "bg_menu" } onClick={ () => this.props.toggleMenuIsVisible(false) } />

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
    menuIsVisible: state.displayMenu.menuIsVisible
})

const mapDispatchToProps = (dispatch) => ({
    setAuthorizedUser: (value) => { dispatch(setAuthorizedUser(value)) },
    toggleMenuIsVisible: (value) => { dispatch(toggleMenuIsVisible(value)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
