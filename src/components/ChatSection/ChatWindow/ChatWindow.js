import React, { useState, useEffect, useRef} from 'react';
import { InView } from 'react-intersection-observer';
import classes from './ChatWindow.module.sass';
import ChatItem from "./ChatItem/ChatItem";
import arrowDown from '../../../assets/arrow.png'
import { togglePreloader } from "../../../redux/preloader";
import { changeMessageStatus } from "../../../redux/dialogsData/dialogsDataActions";
import { setIsNewUserMessage } from "../../../redux/sendNewMessage";
import { connect } from "react-redux";
import Preloader from "../../../common/Preloader/Preloader";


const ChatWindow = ({ dialogsState, changeMessageStatus, preloader, togglePreloader, isNewUserMessage, setIsNewUserMessage }) => {
    const currentUser = dialogsState.currentUser;
    const LIMIT_UNREAD_MESSAGES = 5;
    const chatStart = useRef();
    const chatEnd = useRef();
    const prevMessageUserId = useRef(null);
    const lastReadMessageRef = useRef(null);
    const prevCurrentChatId = useRef(null);
    const currentChat = useRef(dialogsState.dialogs.find(d => d.dialogId === dialogsState.currentDialog));
    const [lastMessageIsVisible, setLastMessageIsVisible] = useState(false);

    const scrollToEnd = (target) => target.current.scrollIntoView({ block: 'end' });
    const smoothScrollDown = () => chatEnd.current.scrollIntoView({ block: "end", behavior: "smooth" });

    useEffect(() => {
        if (prevCurrentChatId.current !== currentChat.current.dialogId && lastReadMessageRef.current) {
            currentChat.current.unreadMessages > LIMIT_UNREAD_MESSAGES ? scrollToEnd(lastReadMessageRef) : scrollToEnd(chatEnd);
            prevCurrentChatId.current = currentChat.current.dialogId;
            togglePreloader(false);
        }
    }, [lastReadMessageRef.current]);

    useEffect(() => {
        isNewUserMessage && scrollToEnd(chatEnd);
        setIsNewUserMessage(false);
        const isNotNewChat = prevCurrentChatId.current === currentChat.current.dialogId;
        isNotNewChat && lastMessageIsVisible && scrollToEnd(chatEnd);
    }, [currentChat.current.messages]);

    const getLastReadMessage = () => {
        const reversedMessages = [...currentChat.current.messages].reverse();
        return reversedMessages.find(message => !message.isRead ? message.userId === currentUser.id && message : message);
    };

    const observeChat = (inView, entry, messageItem, lastReadMessage, lastMessage) => {
        if (lastReadMessage && messageItem.id === lastReadMessage.id) {
            lastReadMessageRef.current = entry.target;
        }
        if (messageItem.id === lastMessage.id) {
            setLastMessageIsVisible(entry.isIntersecting);
        }
        if (entry.isIntersecting && !messageItem.isRead && messageItem.userId !== currentUser.id) {
            changeMessageStatus(dialogsState.currentDialog, messageItem, true, true)
        }
    };

    const getUserChat = () => {
        currentChat.current = dialogsState.dialogs.find(d => d.dialogId === dialogsState.currentDialog);
        prevMessageUserId.current = null;
        const chatMessages = currentChat.current.messages;
        const chatMembers = currentChat.current.members;
        const lastReadMessage = getLastReadMessage();
        const lastMessage = chatMessages[chatMessages.length - 1];
        const interlocutor = chatMembers.find(member => member.id !== currentUser.id);
        if (!lastReadMessage) {
            lastReadMessageRef.current = chatStart.current;
        }

        return chatMessages.map(messageItem => {
            const isSameMessageOwner = prevMessageUserId.current === messageItem.userId;
            prevMessageUserId.current = messageItem.userId;
            return (
                <InView as="div" onChange={ (inView, entry) => observeChat(inView, entry, messageItem, lastReadMessage, lastMessage) } key={ messageItem.id }>
                    <div>
                        <ChatItem
                            isSameMessageOwner={ isSameMessageOwner }
                            avatar={ currentUser.id === messageItem.userId ? currentUser.avatar : interlocutor.avatar }
                            name={ currentUser.id === messageItem.userId ? currentUser.name : interlocutor.name }
                            messageItem={ messageItem }
                            currentUserId={ currentUser.id }
                        />
                    </div>
                </InView>
            )
        });
    };

    return (
        <div className={ classes.chats_window }>
            { preloader && <Preloader isChatWindow={ true }/> }
            <div className={ classes.chat_wrapper }>
                <div ref={ chatStart }/>
                { getUserChat() }
                <div ref={ chatEnd }/>
            </div>

            {
                !lastMessageIsVisible && !!currentChat.current.messages.length &&
                <div className={ classes.arrowDown_wrap }>
                    { !!currentChat.current.unreadMessages &&
                    <span className={ classes.sum_unread_messages }>{ currentChat.current.unreadMessages }</span> }
                    <img src={ arrowDown } className={ classes.arrow_down } onClick={ smoothScrollDown } alt=""/>
                </div>
            }
        </div>
    )
};

const mapStateToProps = (state) => ({
    dialogsState: state.dialogsDataReducer,
    preloader: state.preloader.preloaderIsVisible,
    isNewUserMessage: state.sendNewMessage.isNewUserMessage
});

const mapDispatchToProps = (dispatch) => ({
    changeMessageStatus: (dialogId, message, delivered, read) => dispatch(changeMessageStatus(dialogId, message, delivered, read)),
    togglePreloader: value => dispatch(togglePreloader(value)),
    setIsNewUserMessage: value => dispatch(setIsNewUserMessage(value))
});


export default connect(mapStateToProps, mapDispatchToProps)(ChatWindow)