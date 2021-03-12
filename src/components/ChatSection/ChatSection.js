import React, { useState, useEffect } from 'react';
import classes from './ChatSection.module.sass';
import * as PropTypes from 'prop-types';
import ChatWindow from "./ChatWindow/ChatWindow";
import SendMessagePanel from "./SendMessagePanel/SendMessagePanel";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { addNewMessage, toggleUserIsTyping } from "../../redux/dialogs/dialogsActions";

const ChatSection = (props) => {
    const currentDialogId = props.match.params.dialogId;
    const getCurrentChat = () => props.dialogsData.dialogs.find(d => d.dialogId === currentDialogId);
    const getInterlocutor = (currentChat) => currentChat.members.find(member => member.id !== props.currentUser.id);

    const [currentChat, setCurrentChat] = useState(getCurrentChat());
    const [interlocutor, setInterlocutor] = useState(null);

    useEffect(() => {
        if (currentDialogId) {
            const currentChat = getCurrentChat();
            setCurrentChat(currentChat);
            setInterlocutor(getInterlocutor(currentChat));
        }
    }, [props.dialogsData, currentDialogId]);


    return (
        <div className={ classes.chat_container }>
            { props.match.params.dialogId && currentChat && interlocutor ?
                <>
                    <ChatWindow currentChat={ currentChat } interlocutor={ interlocutor } />
                    <SendMessagePanel currentDialogId={ props.match.params.dialogId } interlocutor={ interlocutor } { ...props } />
                </>
                :
                <div className={ classes.start_text_wrap }>
                    <span className={ classes.start_text_style }>Select a dialog and start communication</span>
                </div> }
        </div>
    )
};

const mapStateToProps = (state) => ({
    isMobileVersion: state.appState.isMobileVersion,
    currentUser: state.userProfile.currentUser,
    dialogsData: state.dialogsReducer
});

const mapDispatchToProps = (dispatch) => ({
    addNewMessage: (interlocutorId, currentDialogId, isFirstMessage, message) => {
        dispatch(addNewMessage(interlocutorId, currentDialogId, isFirstMessage, message))
    },
    toggleUserIsTyping: (dialogId, isTyping, userId, userName) => dispatch(toggleUserIsTyping(dialogId, isTyping, userId, userName))
});

ChatSection.propTypes = {
    isMobileVersion: PropTypes.bool,
    currentUser: PropTypes.object,
    dialogsData: PropTypes.object,
    addNewMessage: PropTypes.func
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(ChatSection)