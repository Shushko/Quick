import React from 'react';
import { connect } from "react-redux";
import { Route, withRouter } from "react-router-dom";
import ChatWindow from "./ChatWindow";
import Preloader from "../../../common/Preloader/Preloader";
import { changeMessageStatus, onChangeCurrentDialog } from "../../../redux/dialogsData/dialogsDataActions";
import { compose } from "redux";

const ChatWindowContainer = (props) => {
    return (
        <>
            {
                !props.currentUser ? <Preloader/> :
                        <Route path="/:dialogId?"
                               render={ () => <ChatWindow {...props} /> }
                        />
            }
        </>
    )
}

const mapStateToProps = (state) => ({
    dialogsState: state.dialogsDataReducer,
    currentUser: state.dialogsDataReducer.currentUser
})

const mapDispatchToProps = (dispatch) => ({
    onChangeCurrentDialog: (value) => { dispatch(onChangeCurrentDialog(value)) },
    changeMessageStatus: (dialogId, message, delivered, read) => { dispatch(changeMessageStatus(dialogId, message, delivered, read)) }
})

export default compose(withRouter, connect(mapStateToProps,mapDispatchToProps))(ChatWindowContainer)
