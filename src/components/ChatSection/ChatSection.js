import React from 'react';
import classes from './ChatSection.module.sass'
import ChatWindowContainer from "./ChatWindow/ChatWindowContainer";
import SendMessagePanelContainer from "./SendMessagePanel/SendMessagePanelContainer";
import { withRouter } from "react-router-dom";

const ChatSection = (props) => {

    return (
        <div className={ classes.chat_container }>
            <ChatWindowContainer/>
            <SendMessagePanelContainer/>
        </div>
    )
}

export default withRouter(ChatSection)