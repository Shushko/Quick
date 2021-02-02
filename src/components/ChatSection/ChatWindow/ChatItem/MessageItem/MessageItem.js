import React from 'react'
import classes from "./MessageItem.module.sass";
import * as PropTypes from 'prop-types';
import moment from "moment";

const MessageItem = ({ messageItem, currentUserId }) => {
    const displayMessageStatus = () => {
        if (messageItem.userId === currentUserId) {
            if (messageItem.isDelivered && messageItem.isRead) return;
            if (!messageItem.isDelivered){
                return <div className={classes.not_delivered} />
            } else {
                return <div className={classes.unread} />
            }
        }
    };

    return (
        <div className={ classes.message_item }>
            <span className={ classes.message_content }>{ messageItem.message }</span>
            <div className={ classes.add_info }>
                { displayMessageStatus() }
                <span className={ classes.message_time }>{ moment(messageItem.time).format('LTS') }</span>
            </div>
        </div>
    )
};

MessageItem.propTypes = {
    messageItem: PropTypes.object,
    currentUserId: PropTypes.string
};

export default MessageItem