import React, { useRef } from 'react';
import classes from "../SendMessageInput/SendMessageInput.module.sass";
import send from "../../../../assets/send.png";

const SendMessageInput = ({ input, onClickSubmit, isMobileVersion, changeStatusIsTyping }, { ...rest }) => {
    const sendMessageTextareaRef = useRef();
    const sendMessageTextareaIsActive = useRef(false);
    const isTyping = useRef(false);
    let timer = null;

    const handleOnKeyPress = () => {
        clearTimeout(timer);
        if (!isTyping.current) {
            changeStatusIsTyping(true);
            isTyping.current = true;
        }
    };

    const handleOnKeyUp = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (isTyping.current) {
                changeStatusIsTyping(false);
                isTyping.current = false
            }
        }, 2000);
    };

    const handleClick = (event) => {
        onClickSubmit(event);
        sendMessageTextareaRef.current.focus();
        sendMessageTextareaIsActive.current = true;
    };

    return (
        <div className={ classes.send_message_panel }>
            <textarea { ...input } { ...rest }
                      className={ classes.send_message_panel_textarea }
                      ref={ sendMessageTextareaRef }
                      onFocus={ () => sendMessageTextareaIsActive.current = true }
                      onBlur={ () => sendMessageTextareaIsActive.current = false }
                      autoFocus={ sendMessageTextareaIsActive.current }
                      onKeyDown={ event => event.key === 'Enter' && onClickSubmit(event) }
                      onKeyPress={ handleOnKeyPress }
                      onKeyUp={ handleOnKeyUp }
            />
            { isMobileVersion ?
                <div className={ classes.send_message_panel_button_mob }>
                    <label htmlFor="sendButtonMob">
                        <img src={ send } className={ classes.send_message_panel_button_mob_image } alt="Send"/>
                    </label>
                    <button id="sendButtonMob" onClick={ e => handleClick(e) } />
                </div>
                :
                <button className={ classes.send_message_panel_button } onClick={ e => handleClick(e) }>Send</button> }
        </div>
    )
};

export default SendMessageInput