import React from "react";
import classes from "./TheDialog.module.sass";
import * as PropTypes from 'prop-types';
import { NavLink } from "react-router-dom";
import moment from "moment";
import defaultAvatar from "../../../assets/defaultAvatar/defaultAvatar.jpg"

const TheDialog = ({ dialog, lastMessage, currentDialogId, interlocutor, handleDialogClick }) => {

    return (
        <NavLink to={ `/${ dialog.dialogId }` }>
            <div onClick={ () => handleDialogClick(dialog) } className={ classes.dialog_item }>
                <div className={ dialog.dialogId === currentDialogId ? classes.active_item : classes.item }>
                    <img src={ interlocutor.avatar ? interlocutor.avatar : defaultAvatar } alt="avatar" />
                    <div className={ classes.dialog_description }>
                        <div className={ classes.dialog_description_user_name }>
                            { interlocutor.name }
                        </div>
                        <div className={ classes.dialog_description_last_message }>
                            { lastMessage && `${ lastMessage.userName }: ${ lastMessage.message }` }
                        </div>
                        <div className={ classes.dialog_description_right}>
                            <div className={ classes.dialog_description_right_last_message_time }>
                                { lastMessage && moment(lastMessage.time).format('LT') }
                            </div>
                            { !!dialog.unreadMessages &&
                            <div className={ classes.dialog_description_right_unread_messages }>{ dialog.unreadMessages }</div> }
                        </div>
                    </div>
                </div>
            </div>
        </NavLink>
    )
};

TheDialog.propTypes = {
    dialog: PropTypes.object,
    getLastMessage: PropTypes.func,
    currentDialog: PropTypes.string,
    getInterlocutor: PropTypes.func,
    handleDialogClick: PropTypes.func
};

export default TheDialog