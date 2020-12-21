import React from 'react';
import classes from './ChatSection.module.sass';
import * as PropTypes from 'prop-types';
import ChatWindow from "./ChatWindow/ChatWindow";
import SendMessagePanelContainer from "./SendMessagePanel/SendMessagePanelContainer";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { addNewMessage } from "../../redux/dialogsData/dialogsDataActions";
import { setIsNewUserMessage } from "../../redux/sendNewMessage";

const ChatSection = (props) => {
    return (
        <div className={ classes.chat_container }>
            { props.dialogsData.currentDialog && props.dialogsData.dialogs.length ? <ChatWindow/> :
                <div className={ classes.startTextWrap }>
                    <span className={ classes.startTextStyle }>Select a dialog and start communication</span>
                </div> }

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

ChatSection.propTypes = {
    dialogsData: PropTypes.object,
    addNewMessage: PropTypes.func,
    setIsNewUserMessage: PropTypes.func
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(ChatSection)