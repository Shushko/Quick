import React from 'react';
import UserDialogs from "./UserDialogs";
import { connect } from "react-redux";
import { onChangeCurrentDialog } from "../../redux/dialogsData/dialogsDataActions";

class UserDialogsContainer extends React.Component {
    render() {
        return (
            <UserDialogs
                dialogs={ this.props.dialogsData.dialogs }
                onChangeCurrentDialog={ this.props.onChangeCurrentDialog }
                currentDialog={ this.props.dialogsData.currentDialog }
                currentUser={ this.props.dialogsData.currentUser }
            />
        )
    }
}

const mapStateToProps = (state) => ({
    dialogsData: state.dialogsDataReducer
})

const mapDispatchToProps = (dispatch) => ({
    onChangeCurrentDialog: (value) => { dispatch(onChangeCurrentDialog(value)) },
})

export default connect(mapStateToProps, mapDispatchToProps)(UserDialogsContainer)
