import React from 'react';
import classes from './SendMessagePanel.module.sass';
import ava from '../../../assets/defaultAvatar/ava.jpg'
import { Field, Form } from 'react-final-form'

const SendMessagePanel = (props) => {
    return (
        <div
            className={ props.currentDialog ? classes.send_message_panel_wrap : classes.send_message_panel_wrap_disable }>
            <div className={ classes.send_message_panel }>
                <img src={ props.currentUser.avatar } alt="ava"/>

                <div className={ classes.send_message_form }>
                    <Form onSubmit={ props.onSubmit }>
                        { ({ handleSubmit, pristine, form }) => (
                            <form onSubmit={ handleSubmit }>
                                <Field component={ "textarea" } name={ "message" }
                                       onKeyDown={ e => {
                                           if (e.key === 'Enter') {
                                               e.preventDefault()
                                               if (!pristine) {
                                                   handleSubmit()
                                                   form.reset()
                                               }
                                           }
                                       } }
                                       placeholder="Type a message..."
                                />

                                <button type="submit" disabled={ pristine }>Send</button>
                            </form>
                        ) }
                    </Form>
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
