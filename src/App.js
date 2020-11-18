import React from 'react';
import './App.sass';
import TheHeader from "./components/Header/TheHeader";
import ChatSection from "./components/ChatSection/ChatSection";
import UserDialogsContainer from "./components/DialogsSection/UserDialogsContainer";
import AuthUser from "./components/AuthUser/AuthUser";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { setAuthorizedUser } from "./redux/authUser/authUserActions";
import { toggleElementVisibility } from "./redux/displayMenu";
import FindUser from "./components/Header/BurgerMenu/FindUser/FindUser";
import Preloader from "./common/Preloader/Preloader";
import { onChangeCurrentDialog, setDialogs } from "./redux/dialogsData/dialogsDataActions";

class App extends React.Component {
    componentDidMount() {
        const userIsAuthorized = !!localStorage.getItem('userIsAuthorized')
        this.props.setAuthorizedUser(userIsAuthorized)
        this.props.onChangeCurrentDialog(this.props.match.params.dialogId)
    }

    render() {
        return (
            <div className="app_container">
                <div
                    className={ this.props.displayMenu.darkBackgroundIsVisible ? "bg_menu_active" : "bg_menu" }
                    onClick={ () => this.props.toggleElementVisibility(false, false, false) }
                />

                { this.props.displayMenu.findUserMenuIsVisible ? <FindUser /> : '' }

                <>
                    {
                        !this.props.userIsAuthorized ? <AuthUser/> :
                            <>
                                { this.props.setDialogs(this.props.history) }
                                {
                                    !this.props.appIsInitialized ? <Preloader/> :
                                        <div className="app_wrapper">
                                            <TheHeader/>
                                            <div className="main_content">
                                                <UserDialogsContainer/>
                                                <ChatSection/>
                                            </div>
                                        </div>
                                }
                            </>

                    }
                </>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    appIsInitialized: state.dialogsDataReducer.appIsInitialized,
    userIsAuthorized: state.authUserReducer.userIsAuthorized,
    displayMenu: state.displayMenu
})

const mapDispatchToProps = (dispatch) => ({
    setAuthorizedUser: (value) => { dispatch(setAuthorizedUser(value)) },
    setDialogs: (routeHistory) => { dispatch(setDialogs(routeHistory)) },
    onChangeCurrentDialog: (value) => { dispatch(onChangeCurrentDialog(value)) },
    toggleElementVisibility: (menuIsVisible, findUserMenuIsVisible, darkBackgroundIsVisible) => {
        dispatch(toggleElementVisibility(menuIsVisible, findUserMenuIsVisible, darkBackgroundIsVisible))
    }
})

export default compose(connect(mapStateToProps,mapDispatchToProps), withRouter)(App)
