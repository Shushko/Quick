import React from 'react';
import classes from './ChatSection.module.sass'
import ChatWindow from "./ChatWindow/ChatWindow";
import SendMessagePanelContainer from "./SendMessagePanel/SendMessagePanelContainer";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { addNewMessage } from "../../redux/dialogsData/dialogsDataActions";
import { setIsNewUserMessage } from "../../redux/sendNewMessage";
import StartText from "../../common/StartText";

const ChatSection = (props) => {
    return (
        <div className={ classes.chat_container }>
            { props.dialogsData.currentDialog && props.dialogsData.dialogs.length ? <ChatWindow/> : <StartText />}
            { props.dialogsData.currentDialog && props.dialogsData.dialogs.length ? <SendMessagePanelContainer { ...props } /> : ''}
        </div>
    )
};

const mapStateToProps = (state) => ({
    dialogsData: state.dialogsDataReducer
});

const mapDispatchToProps = (dispatch) => ({
    addNewMessage: (interlocutorId, messageId, dialogId, userId, time, inputValue) => {
        dispatch(addNewMessage(interlocutorId, messageId, dialogId, userId, time, inputValue)) },
    setIsNewUserMessage: value => dispatch(setIsNewUserMessage(value))
});

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(ChatSection)