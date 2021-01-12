import React from "react";
import classes from "./TheDialog.module.sass";
import * as PropTypes from 'prop-types';
import { NavLink } from "react-router-dom";

const TheDialog = ({ dialog, getLastMessage, changeDialog, currentDialog, getInterlocutor }) => {
    return (
        <NavLink to={ `/${ dialog.dialogId }` }>
            <div onClick={ () => changeDialog(dialog)} className={ classes.dialog_item }>
                <div className={ dialog.dialogId === currentDialog ? classes.active_item : classes.item }>
                    <img src={ getInterlocutor(dialog.members).avatar } alt="avatar" />
                    <div className={ classes.dialog_description }>
                        <span className={ classes.dialog_description_user_name }>
                            { getInterlocutor(dialog.members).name }
                        </span>
                        <span className={ classes.dialog_description_last_time }>
                            { getLastMessage(dialog.messages).time }
                        </span>
                        <div className={ classes.dialog_description_message }>
                            <span className={ classes.last_message }>
                                { getLastMessage(dialog.messages).message }
                            </span>
                            { !!dialog.unreadMessages && <div className={ classes.unread_messages }>{ dialog.unreadMessages }</div> }
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
    changeDialog: PropTypes.func,
    currentDialog: PropTypes.string,
    getInterlocutor: PropTypes.func
};

export default TheDialog