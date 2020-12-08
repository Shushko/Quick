import React from "react";
import classes from "./ChatItem.module.sass";
import MessageItem from "./MessageItem/MessageItem";

const ChatItem = ({ isSameMessageOwner, avatar, name, messageItem, currentUserId }) => {
    return (
        <div className={ classes.chat_message_item }>
            { !isSameMessageOwner &&
            <>
                <img src={ avatar } className={ classes.user_photo } alt="avatar"/>
                <span className={ classes.user_name }>{ name }</span>
            </> }
            <MessageItem messageItem={ messageItem } currentUserId={ currentUserId }/>
        </div>
    );
};

export default ChatItem