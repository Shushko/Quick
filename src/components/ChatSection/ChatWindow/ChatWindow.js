import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { InView } from 'react-intersection-observer';
import classes from './ChatWindow.module.sass';
import * as PropTypes from 'prop-types';
import ChatItem from "./ChatItem/ChatItem";
import arrowDown from '../../../assets/arrow.png'
import { togglePreloader } from "../../../redux/preloader";
import { changeMessageStatus, uploadChatMessages } from "../../../redux/dialogs/dialogsActions";
import { connect } from "react-redux";
import Preloader from "../../../common/Preloader/Preloader";

const ChatWindow = ({ currentChat, currentUser, changeMessageStatus, preloaderIsVisible, togglePreloader, isMobileVersion, ...props }) => {
    const chatWindowRef = useRef();
    const chatStart = useRef();
    const chatEnd = useRef();
    const prevMessageUserId = useRef(null);
    const [lastReadMessageRef, setLastReadMessageRef] = useState(null);
    const [lastMessageIsVisible, setLastMessageIsVisible] = useState(false);
    const lastMessageIsVisibleRef = useRef(false);

    const scrollToEnd = (target) => target.current && target.current.scrollIntoView({ block: 'end' });
    const smoothScrollDown = () => chatEnd.current.scrollIntoView({ block: 'end', behavior: 'smooth' });

    const setChatWindowHeight = () => {
        const HEIGHT_GAP = isMobileVersion ? 104 : 180;
        if (chatWindowRef.current) { chatWindowRef.current.style.height = `${ window.innerHeight - HEIGHT_GAP }px`; }
    };
    window.addEventListener('resize', () => {
        lastMessageIsVisibleRef.current && scrollToEnd(chatEnd);
        setChatWindowHeight();
    });
    isMobileVersion && setChatWindowHeight();


    useEffect(() => {
        !currentChat.chatIsOpened && currentChat.messages.length && props.uploadChatMessages(currentChat.dialogId, currentChat.messages[0].time);
        lastMessageIsVisible && scrollToEnd(chatEnd)
    }, [currentChat]);

    useEffect(() => {
        const UNREAD_MESSAGES_LIMIT = 5;
        !currentChat.messages.length && preloaderIsVisible && togglePreloader(false);
        if (lastReadMessageRef) {
            currentChat.unreadMessages > UNREAD_MESSAGES_LIMIT ? scrollToEnd(lastReadMessageRef) : scrollToEnd(chatEnd);
            preloaderIsVisible && togglePreloader(false);
        }
    }, [lastReadMessageRef]);

    const getLastReadMessage = () => {
        const reversedMessages = [...currentChat.messages].reverse();
        return reversedMessages.find(message => !message.isRead ? message.userId === currentUser.id && message : message);
    };

    const observeChat = (inView, entry, messageItem, lastReadMessage, lastMessage) => {
        if (lastReadMessage && messageItem.id === lastReadMessage.id) {
            lastReadMessageRef !== entry.target && setLastReadMessageRef(entry.target)
        }
        if (messageItem.id === lastMessage.id) {
            lastMessageIsVisibleRef.current = entry.isIntersecting;
            setLastMessageIsVisible(entry.isIntersecting);
        }
        if (entry.isIntersecting && !messageItem.isRead && messageItem.userId !== currentUser.id) {
            changeMessageStatus(currentChat.dialogId, messageItem, true, true)
        }
        if (entry.isIntersecting && entry.intersectionRatio < 1 && currentChat.messages[0].id === messageItem.id) {
            props.uploadChatMessages(currentChat.dialogId, messageItem.time)
        }
    };

    const getUserChat = () => {
        prevMessageUserId.current = null;
        const chatMessages = currentChat.messages;
        const chatMembers = currentChat.members;
        const lastReadMessage = getLastReadMessage();
        const lastMessage = chatMessages[chatMessages.length - 1];
        const interlocutor = chatMembers.find(member => member.id !== currentUser.id);
        !lastReadMessage && lastReadMessageRef !== chatStart.current && setLastReadMessageRef(chatStart.current);

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
            { preloaderIsVisible && <Preloader type={ 'chat_window' }/> }
            <div className={ classes.chat_wrapper }>
                <div ref={ chatStart }/>
                { getUserChat() }
                <div className={ classes.chat_end } ref={ chatEnd }/>
            </div>

            { props.communicationProcess && props.communicationProcess.dialogId === currentChat.dialogId &&
            <div className={ classes.user_is_typing_wrap }>
                <span className={ classes.user_is_typing }>
                    { `${ props.communicationProcess.userName } is typing...` }
                </span>
            </div> }

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
    preloaderIsVisible: state.preloader.preloaderIsVisible,
    communicationProcess: state.dialogsReducer.communicationProcess
});

const mapDispatchToProps = (dispatch) => ({
    changeMessageStatus: (dialogId, message, delivered, read) => dispatch(changeMessageStatus(dialogId, message, delivered, read)),
    uploadChatMessages: (dialogId, lastMessageTime) => dispatch(uploadChatMessages(dialogId, lastMessageTime)),
    togglePreloader: value => dispatch(togglePreloader(value))
});

ChatWindow.propTypes = {
    isMobileVersion: PropTypes.bool,
    currentChat: PropTypes.object,
    currentUser: PropTypes.object,
    preloaderIsVisible: PropTypes.bool,
    changeMessageStatus: PropTypes.func,
    uploadChatMessages: PropTypes.func,
    togglePreloader: PropTypes.func
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(ChatWindow)