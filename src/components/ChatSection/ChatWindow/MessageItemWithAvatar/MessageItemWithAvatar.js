import React from "react";
import classes from "./MessageItemWithAvatar.module.sass";
import * as PropTypes from 'prop-types';
import MessageItem from "../MessageItem/MessageItem";

const MessageItemWithAvatar = ({ message, interlocutor, currentUser }) => {
    const avatar = currentUser.id === message.userId ? currentUser.avatar : interlocutor.avatar;
    const name = currentUser.id === message.userId ? currentUser.name : interlocutor.name;

    return (
        <div className={ classes.message_item }>
            <img src={ avatar } className={ classes.user_photo } alt="avatar"/>
            <span className={ classes.user_name }>{ name }</span>
            <MessageItem message={ message } currentUser={ currentUser }/>
        </div>
    )
};

MessageItemWithAvatar.propTypes = {
    message: PropTypes.object,
    interlocutor: PropTypes.object,
    currentUser: PropTypes.object
};

export default MessageItemWithAvatar