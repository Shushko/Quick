import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { InView } from 'react-intersection-observer';
import classes from './ChatWindow.module.sass';
import * as PropTypes from 'prop-types';
import ChatItem from "./ChatItem/ChatItem";
import arrowDown from '../../../assets/arrow.png'
import { togglePreloader } from "../../../redux/preloader";
import { changeMessageStatus, toggleUserSentNewMessage } from "../../../redux/dialogsData/dialogsDataActions";
import { connect } from "react-redux";
import Preloader from "../../../common/Preloader/Preloader";


const ChatWindow = ({ dialogsState, currentUser, changeMessageStatus, preloader, togglePreloader, isMobileVersion, ...props }) => {
    const LIMIT_UNREAD_MESSAGES = 5;
    const chatStart = useRef();
    const chatEnd = useRef();
    const prevMessageUserId = useRef(null);
    const [lastReadMessageRef, setLastReadMessageRef] = useState(null);
    const prevCurrentChatId = useRef(null);
    const [currentChat, setCurrentChat] = useState(dialogsState.dialogs.find(d => d.dialogId === props.match.params.dialogId));
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
        setCurrentChat(dialogsState.dialogs.find(d => d.dialogId === props.match.params.dialogId));
    }, [props.match.params.dialogId]);

    useEffect(() => {
        if (prevCurrentChatId.current !== currentChat.dialogId && lastReadMessageRef) {
            currentChat.unreadMessages > LIMIT_UNREAD_MESSAGES ? scrollToEnd(lastReadMessageRef) : scrollToEnd(chatEnd);
            prevCurrentChatId.current = currentChat.dialogId;
            togglePreloader(false);
        }
    }, [lastReadMessageRef]);

    useEffect(() => {
        dialogsState.userSentNewMessage && scrollToEnd(chatEnd);
        props.toggleUserSentNewMessage(false);
        const isNotNewChat = prevCurrentChatId.current === currentChat.dialogId;
        isNotNewChat && lastMessageIsVisible && scrollToEnd(chatEnd);
    }, [currentChat.messages]);

    const getLastReadMessage = () => {
        const reversedMessages = [...currentChat.messages].reverse();
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
            changeMessageStatus(currentChat.dialogId, messageItem, true, true)
        }
    };

    const getUserChat = () => {
        prevMessageUserId.current = null;
        const chatMessages = currentChat.messages;
        const chatMembers = currentChat.members;
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

            { !lastMessageIsVisible && !!currentChat.messages.length &&
            <div className={ classes.arrowDown_wrap }>
                { !!currentChat.unreadMessages &&
                <span className={ classes.sum_unread_messages }>{ currentChat.unreadMessages }</span> }
                <img src={ arrowDown } className={ classes.arrow_down } onClick={ smoothScrollDown } alt="arrow down"/>
            </div> }
        </div>
    )
};

const mapStateToProps = (state) => ({
    isMobileVersion: state.appState.isMobileVersion,
    currentUser: state.userProfile.currentUser,
    appHeight: state.appState.appHeight,
    dialogsState: state.dialogsDataReducer,
    preloader: state.preloader.preloaderIsVisible,
});

const mapDispatchToProps = (dispatch) => ({
    changeMessageStatus: (dialogId, message, delivered, read) => dispatch(changeMessageStatus(dialogId, message, delivered, read)),
    togglePreloader: value => dispatch(togglePreloader(value)),
    toggleUserSentNewMessage: value => dispatch(toggleUserSentNewMessage(value))
});

ChatWindow.propTypes = {
    dialogsState: PropTypes.object,
    isMobileVersion: PropTypes.bool,
    preloader: PropTypes.bool,
    appHeight: PropTypes.number,
    changeMessageStatus: PropTypes.func,
    togglePreloader: PropTypes.func,
    toggleUserSentNewMessage: PropTypes.func,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(ChatWindow)