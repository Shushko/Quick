import React from "react";
import classes from "./TheDialog.module.sass";
import { NavLink } from "react-router-dom";

const TheDialog = (props) => {
    return (
        <NavLink to={`/${props.dialog.dialogId}`}>
            <div onClick={ () => { props.onChangeCurrentDialog(props.dialog.dialogId) } } className={ classes.dialog_item }>

                <div className={ props.dialog.dialogId === props.currentDialog ? classes.active_item : classes.item }>
                    <img src={ props.getInterlocutor(props.dialog.members).avatar } alt="avatar" />
                    <div className={ classes.dialog_description }>
                        <span className={ classes.dialog_description_user_name }>
                            { props.getInterlocutor(props.dialog.members).name }
                        </span>
                        <span className={ classes.dialog_description_last_time }>
                            {  props.getLastMessage(props.dialog.messages).time }
                        </span>
                        <div className={ classes.dialog_description_message }>
                            <span className={ classes.last_message }>
                                { props.getLastMessage(props.dialog.messages).message }
                            </span>
                            { props.dialog.unreadMessages > 0 ?
                                    <div className={ classes.unread_messages }>{ props.dialog.unreadMessages }</div> :
                                    <div/> }
                        </div>
                    </div>
                </div>

            </div>
        </NavLink>
    )
}

export default TheDialog