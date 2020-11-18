import React from 'react';
import classes from './ChatSection.module.sass'
import ChatWindowContainer from "./ChatWindow/ChatWindowContainer";
import SendMessagePanelContainer from "./SendMessagePanel/SendMessagePanelContainer";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { addNewMessage } from "../../redux/dialogsData/dialogsDataActions";

const ChatSection = (props) => {
    return (
        <div className={ classes.chat_container }>
            <ChatWindowContainer/>
            { props.dialogsData.currentDialog && props.dialogsData.dialogs.length ? <SendMessagePanelContainer { ...props } /> : <div />}
        </div>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.dialogsDataReducer.currentUser,
    dialogsData: state.dialogsDataReducer
})

const mapDispatchToProps = (dispatch) => ({
    addNewMessage: (interlocutorId, messageId, dialogId, userId, time, inputValue) => {
        dispatch(addNewMessage(interlocutorId, messageId, dialogId, userId, time, inputValue)) }
})

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(ChatSection)