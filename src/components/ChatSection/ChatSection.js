import React from 'react';
import classes from './ChatSection.module.sass';
import * as PropTypes from 'prop-types';
import ChatWindow from "./ChatWindow/ChatWindow";
import SendMessagePanel from "./SendMessagePanel/SendMessagePanel";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { addNewMessage, toggleUserSentNewMessage } from "../../redux/dialogsData/dialogsDataActions";

const ChatSection = (props) => {

    const currentDialogId = props.match.params.dialogId;

    return (
        <div className={ classes.chat_container }>
            { !!currentDialogId ?
                <>
                    <ChatWindow/>
                    <SendMessagePanel currentDialogId={ currentDialogId } { ...props } />
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
    dialogsData: state.dialogsDataReducer,
});

const mapDispatchToProps = (dispatch) => ({
    addNewMessage: (interlocutorId, messageId, dialogId, userId, time, inputValue) => {
        dispatch(addNewMessage(interlocutorId, messageId, dialogId, userId, time, inputValue))
    },
    toggleUserSentNewMessage: value => dispatch(toggleUserSentNewMessage(value))
});

ChatSection.propTypes = {
    isMobileVersion: PropTypes.bool,
    currentUser: PropTypes.object,
    dialogsData: PropTypes.object,
    addNewMessage: PropTypes.func,
    setIsNewUserMessage: PropTypes.func
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(ChatSection)