import React from "react";
import classes from "./TheDialog.module.sass";
import { NavLink } from "react-router-dom";

const TheDialog = ({ dialog, getLastMessage, onChangeCurrentDialog, currentDialog, getInterlocutor }) => {
    console.log('RENDER');
    return (
        <NavLink to={`/${ dialog.dialogId }`}>
            <div onClick={ () => { onChangeCurrentDialog(dialog.dialogId) } } className={ classes.dialog_item }>

                <div className={ dialog.dialogId === currentDialog ? classes.active_item : classes.item }>
                    <img src={ getInterlocutor(dialog.members).avatar } alt="avatar" />
                    <div className={ classes.dialog_description }>
                        <span className={ classes.dialog_description_user_name }>
                            { getInterlocutor(dialog.members).name }
                        </span>
                        <span className={ classes.dialog_description_last_time }>
                            {  getLastMessage(dialog.messages).time }
                        </span>
                        <div className={ classes.dialog_description_message }>
                            <span className={ classes.last_message }>
                                { getLastMessage(dialog.messages).message }
                            </span>
                            { dialog.unreadMessages > 0 ?
                                    <div className={ classes.unread_messages }>{ dialog.unreadMessages }</div> :
                                    <div/> }
                        </div>
                    </div>
                </div>

            </div>
        </NavLink>
    )
}

export default TheDialog