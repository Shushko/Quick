import React from 'react'
import classes from "./MessageItem.module.sass";
import * as PropTypes from 'prop-types';
import moment from "moment";

const MessageItem = ({ message, currentUser }) => {
    return (
        <div className={ classes.message_item }>
            <span className={ classes.message_content }>{ message.message }</span>
            <div className={ classes.message_info }>
                <div>
                    { message.userId === currentUser.id && !message.isRead &&
                    <div className={ message.isDelivered ? classes.unread : classes.not_delivered } /> }
                </div>
                <span className={ classes.message_info_time }>{ moment(message.time).format('LTS') }</span>
            </div>
        </div>
    )
};

MessageItem.propTypes = {
    messageItem: PropTypes.object,
    currentUser: PropTypes.object
};

export default MessageItem