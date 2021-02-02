import React, { useState, useEffect, useRef } from 'react';
import { InView } from 'react-intersection-observer';
import classes from './ChatWindow.module.sass';
import * as PropTypes from 'prop-types';
import ChatItem from "./ChatItem/ChatItem";
import arrowDown from '../../../assets/arrow.png'
import { togglePreloader } from "../../../redux/preloader";
import { changeMessageStatus } from "../../../redux/dialogsData/dialogsDataActions";
import { setIsNewUserMessage } from "../../../redux/sendNewMessage";
import { connect } from "react-redux";
import Preloader from "../../../common/Preloader/Preloader";


const ChatWindow = ({ dialogsState, changeMessageStatus, preloader, togglePreloader, isNewUserMessage, setIsNewUserMessage, isMobileVersion }) => {
    const currentUser = dialogsState.currentUser;
    const LIMIT_UNREAD_MESSAGES = 5;
    const chatStart = useRef();
    const chatEnd = useRef();
    const prevMessageUserId = useRef(null);
    const [lastReadMessageRef, setLastReadMessageRef] = useState(null);
    const prevCurrentChatId = useRef(null);
    const currentChat = useRef(dialogsState.dialogs.find(d => d.dialogId === dialogsState.currentDialog));
    const [lastMessageIsVisible, setLastMessageIsVisible] = useState(false);
    const refLastMessageIsVisible = useRef(false);
    const chatWindowRef = useRef();


    const setChatWindowHeight = () => {
        if (chatWindowRef.current) {
            if (isMobileVersion) {
                chatWindowRef.current.style.height = `${ window.innerHeight - 104 }px`;
            } else {
                chatWindowRef.current.style.height = `${ window.innerHeight - 180 }px`;
            }
        }
    };

    const scrollToEnd = (target) => target.current && target.current.scrollIntoView({ block: 'end' });
    const smoothScrollDown = () => chatEnd.current.scrollIntoView({ block: 'end', behavior: 'smooth' });

    window.addEventListener('resize', () => {
        refLastMessageIsVisible.current && scrollToEnd(chatEnd);
        setChatWindowHeight();
    });

    isMobileVersion && setChatWindowHeight();

    useEffect(() => {
        if (prevCurrentChatId.current !== currentChat.current.dialogId && lastReadMessageRef) {
            currentChat.current.unreadMessages > LIMIT_UNREAD_MESSAGES ? scrollToEnd(lastReadMessageRef) : scrollToEnd(chatEnd);
            prevCurrentChatId.current = currentChat.current.dialogId;
            togglePreloader(false);
        }
    }, [lastReadMessageRef]);

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
            lastReadMessageRef !== entry.target && setLastReadMessageRef(entry.target)
        }
        if (messageItem.id === lastMessage.id) {
            refLastMessageIsVisible.current = entry.isIntersecting;
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
            lastReadMessageRef !== chatStart.current && setLastReadMessageRef(chatStart.current)
        }

        return chatMessages.map(messageItem => {
            const isSameMessageOwner = prevMessageUserId.current === messageItem.userId;
            prevMessageUserId.current = messageItem.userId;
            return (
                <InView as="div"
                        onChange={ (inView, entry) => observeChat(inView, entry, messageItem, lastReadMessage, lastMessage) }
                        key={ messageItem.id }>
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
        <div className={ classes.chat_window } ref={ chatWindowRef }>
            { preloader && <Preloader type={ 'chat_window' }/> }
            <div className={ classes.chat_wrapper }>
                <div ref={ chatStart }/>
                { getUserChat() }
                <div ref={ chatEnd }/>
            </div>

            { !lastMessageIsVisible && !!currentChat.current.messages.length &&
            <div className={ classes.arrowDown_wrap }>
                { !!currentChat.current.unreadMessages &&
                <span className={ classes.sum_unread_messages }>{ currentChat.current.unreadMessages }</span> }
                <img src={ arrowDown } className={ classes.arrow_down } onClick={ smoothScrollDown } alt="arrow down"/>
            </div> }
        </div>
    )
};

const mapStateToProps = (state) => ({
    isMobileVersion: state.appState.isMobileVersion,
    appHeight: state.appState.appHeight,
    dialogsState: state.dialogsDataReducer,
    preloader: state.preloader.preloaderIsVisible,
    isNewUserMessage: state.sendNewMessage.isNewUserMessage
});

const mapDispatchToProps = (dispatch) => ({
    changeMessageStatus: (dialogId, message, delivered, read) => dispatch(changeMessageStatus(dialogId, message, delivered, read)),
    togglePreloader: value => dispatch(togglePreloader(value)),
    setIsNewUserMessage: value => dispatch(setIsNewUserMessage(value))
});

ChatWindow.propTypes = {
    dialogsState: PropTypes.object,
    isMobileVersion: PropTypes.bool,
    preloader: PropTypes.bool,
    appHeight: PropTypes.number,
    isNewUserMessage: PropTypes.bool,
    changeMessageStatus: PropTypes.func,
    togglePreloader: PropTypes.func,
    setIsNewUserMessage: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatWindow)