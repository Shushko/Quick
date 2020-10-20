import React from "react";
import classes from "./ChatItem.module.sass";
import moment from "moment";

const ChatItem = (props) => {
    return (
        <div className={ props.messageUserId === props.item.userId ? classes.chat_item : classes.chat_item_first }>

            { props.messageUserId === props.item.userId ? <div/> :
                <img
                    src={ props.currentUser.id === props.item.userId ? props.currentUser.avatar : props.interlocutor.avatar }
                    className={ classes.user_photo }
                    alt="avatar"
                />
            }

            <div className={ classes.user_message }>
                { props.messageUserId === props.item.userId ? <div/> :
                    <span className={ classes.user_name }>
                        { props.currentUser.id === props.item.userId ? `${ props.currentUser.name }` : `${ props.interlocutor.name }` }
                    </span>
                }

                <div
                    className={ props.messageUserId === props.item.userId ? classes.message_item : classes.message_item_first }>
                    <span className={ classes.message_content }>{ props.item.message }</span>
                    <div>
                        { (!props.item.isDelivered || !props.item.isRead) && props.currentUser.id === props.item.userId ?
                            <div className={ !props.item.isDelivered ? classes.message_status_delivered : classes.message_status_read }/> :
                            <div /> }
                        <span className={ classes.message_time }>{  moment(props.item.time).format('LTS') }</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatItem