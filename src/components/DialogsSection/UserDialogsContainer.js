import React from 'react';
import Preloader from "../../common/Preloader/Preloader";
import UserDialogs from "./UserDialogs";
import { connect } from "react-redux";
import {
    onChangeCurrentDialog,
    setDialogs,
    toggleIsFetching
} from "../../redux/dialogsData/dialogsDataActions";

class UserDialogsContainer extends React.Component {
    componentDidMount() {
        try {
            this.props.setDialogs()
        } catch (error) {
            console.log(error)
        } finally {
            this.props.toggleIsFetching(false)
        }
    }

    render() {
        return (
            <>
                {
                    this.props.preloader ? <Preloader/> :
                        <UserDialogs
                            dialogs={ this.props.dialogs }
                            onChangeCurrentDialog={ this.props.onChangeCurrentDialog }
                            currentDialog={ this.props.currentDialog }
                            currentUser={ this.props.currentUser }
                        />
                }
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    dialogs: state.dialogsDataReducer.dialogs,
    currentDialog: state.dialogsDataReducer.currentDialog,
    preloader: state.dialogsDataReducer.isFetching,
    currentUser: state.dialogsDataReducer.currentUser
})

const mapDispatchToProps = (dispatch) => ({
    onChangeCurrentDialog: (value) => { dispatch(onChangeCurrentDialog(value)) },
    toggleIsFetching: (value) => { dispatch(toggleIsFetching(value)) },
    setDialogs: () => { dispatch(setDialogs()) }
})

export default connect(mapStateToProps, mapDispatchToProps)(UserDialogsContainer)
