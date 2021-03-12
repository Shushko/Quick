import React from 'react';
import classes from "./SendMessagePanel.module.sass";
import InputForm from "../../../common/InputForm/InputForm";
import * as PropTypes from 'prop-types';
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import defaultAvatar from "../../../assets/defaultAvatar/defaultAvatar.jpg"

const SendMessagePanel = ({ isMobileVersion, currentDialogId, currentUser, interlocutor, dialogsData, addNewMessage, toggleUserIsTyping }) => {

    const onSubmit = (formData) => {
        const isFirstMessage = !dialogsData.dialogs.find(d => d.dialogId === currentDialogId).messages.length;
        const time = moment().valueOf();
        const message = {
            [time]:{
                id: uuidv4(),
                time: time,
                message: formData[currentDialogId],
                isDelivered: false,
                isRead: false,
                userId: currentUser.id,
                userName: currentUser.name
            }
        };
        addNewMessage(interlocutor.id, currentDialogId, isFirstMessage, message);
    };

    const changeStatusIsTyping = (isTyping) => toggleUserIsTyping(currentDialogId, isTyping, currentUser.id, currentUser.name);

    return (
        <div className={ classes.send_message_panel_wrap }>
            <div className={ classes.send_message_panel }>
                { !isMobileVersion &&
                <img src={ currentUser.avatar } className={ classes.send_message_panel_avatar } alt="avatar"/> }

                <InputForm
                    formType={ 'send_message_panel' }
                    inputName={ currentDialogId }
                    onSubmit={ onSubmit }
                    changeStatusIsTyping={ changeStatusIsTyping }
                    placeholder={ "Type a message..." }
                    currentDialogId={ currentDialogId }
                    isMobileVersion={ isMobileVersion }
                />

                { !isMobileVersion &&
                <img src={ interlocutor && interlocutor.avatar ? interlocutor.avatar : defaultAvatar }
                     className={ classes.send_message_panel_avatar } alt="avatar" /> }
            </div>
        </div>
    )
};

SendMessagePanel.propTypes = {
    isMobileVersion: PropTypes.bool,
    currentUser: PropTypes.object,
    interlocutor: PropTypes.object,
    dialogsData: PropTypes.object,
    currentDialogId: PropTypes.string,
    addNewMessage: PropTypes.func,
    toggleUserIsTyping: PropTypes.func
};

export default SendMessagePanel