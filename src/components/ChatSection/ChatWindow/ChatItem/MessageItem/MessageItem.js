import React from 'react'
import classes from "./MessageItem.module.sass";
import moment from "moment";

const MessageItem = ({ messageItem, currentUserId }) => {
    return (
        <div className={ classes.message_item }>
            <span className={ classes.message_content }>{ messageItem.message }</span>
            <div>
                { messageItem.userId === currentUserId && (!messageItem.isDelivered || !messageItem.isRead) &&
                <div className={ !messageItem.isDelivered ? classes.delivered : classes.read } /> }

                <span className={ classes.message_time }>{  moment(messageItem.time).format('LTS') }</span>
            </div>
        </div>
    )
};

export default MessageItem