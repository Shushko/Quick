import React from 'react';
import classes from './SendMessagePanel.module.sass';
import ava from '../../../assets/defaultAvatar/ava.jpg'
import InputForm from "../../../common/InputForm/InputForm";

const SendMessagePanel = (props) => {
    return (
        <div className={ classes.send_message_panel_wrap }>
            <div className={ classes.send_message_panel }>
                <img src={ props.currentUser.avatar } alt="ava"/>

                <div className={ classes.send_message_form }>
                    <InputForm
                        formType={ 'send_message_panel' }
                        inputName={ 'message' }
                        onSubmit={ props.onSubmit }
                        placeholder={ "Type a message..." }
                    />
                </div>

                <img src={ props.interlocutor ? props.interlocutor.avatar : ava } alt="ava" />
            </div>
        </div>
    )
}

export default SendMessagePanel
