import React from 'react';
import classes from './SendMessagePanel.module.sass';
import ava from '../../../assets/defaultAvatar/ava.jpg'

const SendMessagePanel = (props) => {
    return (
        <div
            className={ props.currentDialog ? classes.send_message_panel_wrap : classes.send_message_panel_wrap_disable }>
            <div className={ classes.send_message_panel }>
                <img src={ props.currentUser.avatar } alt="ava"/>

                <div className={ classes.send_message_form }>
                    <textarea
                        onChange={ props.onChangeInput }
                        onKeyDown={ props.sendMessage }
                        value={ props.inputValue }
                        placeholder="Type a message..."
                    />
                    <button onClick={ props.sendMessage }>Send</button>
                </div>

                <img
                    src={ props.interlocutor ? props.interlocutor.avatar : ava }
                    alt="ava"
                />
            </div>
        </div>
    )
}

export default SendMessagePanel