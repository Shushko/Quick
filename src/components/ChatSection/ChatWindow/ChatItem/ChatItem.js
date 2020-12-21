import React from "react";
import classes from "./ChatItem.module.sass";
import * as PropTypes from 'prop-types';
import MessageItem from "./MessageItem/MessageItem";

const ChatItem = ({ isSameMessageOwner, avatar, name, messageItem, currentUserId }) => (
    <div className={ classes.chat_message_item }>
        { !isSameMessageOwner &&
        <>
            <img src={ avatar } className={ classes.user_photo } alt="avatar"/>
            <span className={ classes.user_name }>{ name }</span>
        </> }
        <MessageItem messageItem={ messageItem } currentUserId={ currentUserId }/>
    </div>
);

ChatItem.propTypes = {
    isSameMessageOwner: PropTypes.bool,
    avatar: PropTypes.string,
    name: PropTypes.string,
    messageItem: PropTypes.object,
    currentUserId: PropTypes.string,
};

export default ChatItem