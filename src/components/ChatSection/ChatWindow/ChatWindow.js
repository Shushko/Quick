import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { InView } from 'react-intersection-observer';
import classes from './ChatWindow.module.sass';
import { connect } from "react-redux";
import moment from "moment";
import * as PropTypes from 'prop-types';
import arrowDown from '../../../assets/arrow.png';
import { togglePreloader } from "../../../redux/preloader";
import { changeMessageStatus, uploadChatMessages } from "../../../redux/dialogs/dialogsActions";
import Preloader from "../../../common/Preloader/Preloader";
import MessageItem from "./MessageItem/MessageItem";
import MessageItemWithAvatar from "./MessageItemWithAvatar/MessageItemWithAvatar";

const ChatWindow = ({ currentChat, currentUser, interlocutor, preloaderIsVisible, togglePreloader, isMobileVersion, ...props }) => {
    const chatWindowRef = useRef();
    const chatWrapperRef = useRef();
    const chatStart = useRef();
    const chatEnd = useRef();
    const [lastReadMessageRef, setLastReadMessageRef] = useState(null);
    const [lastMessageIsVisible, setLastMessageIsVisible] = useState(false);
    const lastMessageIsVisibleRef = useRef(false);
    const observedDates = useRef([]);

    const scrollToEnd = (target) => target && target.scrollIntoView({ block: 'end' });
    const smoothScrollDown = () => chatEnd.current.scrollIntoView({ block: 'end', behavior: 'smooth' });

    const setChatWindowHeight = () => {
        const HEIGHT_GAP = isMobileVersion ? 104 : 180;
        if (chatWindowRef.current) { chatWindowRef.current.style.height = `${ window.innerHeight - HEIGHT_GAP }px`; }
    };
    window.addEventListener('resize', () => {
        lastMessageIsVisibleRef.current && scrollToEnd(chatEnd.current);
        setChatWindowHeight();
    });
    isMobileVersion && setChatWindowHeight();

    useEffect(() => {
        observedDates.current = [];
        !currentChat.chatIsOpened && currentChat.messages.length && props.uploadChatMessages(currentChat.dialogId, currentChat.messages[0].time);
        // lastMessageIsVisible && scrollToEnd(chatEnd)
    }, [currentChat]);

    useEffect(() => {
        const UNREAD_MESSAGES_LIMIT = 0;
        // !currentChat.messages.length && preloaderIsVisible && togglePreloader(false);
        if (lastReadMessageRef) {
            currentChat.unreadMessages > UNREAD_MESSAGES_LIMIT ? scrollToEnd(lastReadMessageRef) : scrollToEnd(chatEnd.current);

        }
    }, [lastReadMessageRef]);

    const observeMessage = (entry, message, lastReadMessage, lastMessage) => {
        if (lastReadMessage && message.id === lastReadMessage.id) {
            lastReadMessageRef !== entry.target && setLastReadMessageRef(entry.target)
        }
        if (message.id === lastMessage.id) {
            lastMessageIsVisibleRef.current = entry.isIntersecting;
            setLastMessageIsVisible(entry.isIntersecting);
        }
        if (entry.isIntersecting && !message.isRead && message.userId !== currentUser.id) {
            console.log(message);
            props.changeMessageStatus(currentChat.dialogId, message, true, true)
        }
        if (entry.isIntersecting && entry.intersectionRatio < 1 && currentChat.messages[0].id === message.id) {
            props.uploadChatMessages(currentChat.dialogId, message.time)
        }
    };

    const observeDate = (entry, message) => {
        const getDateKey = time => moment(time).format('DMY');
        if (entry.isIntersecting) {
            observedDates.current.push({ dateRef: entry.target, date: message.time });
        } else {
            observedDates.current = observedDates.current.filter(item => getDateKey(item.date) !== getDateKey(message.time));
        }
    };

    let timer = null;
    const handleOnScroll = () => {
        if (observedDates.current.length) {
            const activeDate = observedDates.current.sort((a, b) => a.date > b.date ? 1 : -1)[0];
            clearTimeout(timer);
            activeDate.dateRef.className = `${ classes.date_wrap }`;
            timer = setTimeout(() => activeDate.dateRef.className = `${ classes.hide_date }`, 1000);
        }
    };

    const getLastReadMessage = () => {
        const reversedMessages = [...currentChat.messages].reverse();
        return reversedMessages.find(message => !message.isRead ? message.userId === currentUser.id && message : message);
    };

    const setInView = (element, callback, message, lastReadMessage, lastMessage) => {
        return (
            <InView as="div" onChange={ (inView, entry) => callback(entry, message, lastReadMessage, lastMessage) } key={ message.id }>
                { element }
            </InView>
        )
    };

    const getMessageElement = (isFirstMessageOfBlock, message, lastReadMessage, lastMessage) => {
        const params = { message, interlocutor, currentUser };
        const messageItem = isFirstMessageOfBlock ? <MessageItemWithAvatar { ...params } /> : <MessageItem { ...params } />;
        return setInView(messageItem, observeMessage, message, lastReadMessage, lastMessage)
    };

    const getDateElement = (message) => {
        const date = <span className={ classes.date }>{ moment(message.time).format('MMMM D') }</span>;
        return <div className={ classes.date_wrap } key={ message.time }>{ setInView(date, observeDate, message) }</div>
    };

    const getUserChat = () => {
        preloaderIsVisible && togglePreloader(false);
        const chatMessages = currentChat.messages;
        const lastReadMessage = getLastReadMessage();
        const lastMessage = chatMessages[chatMessages.length - 1];
        !lastReadMessage && lastReadMessageRef !== chatStart.current && setLastReadMessageRef(chatStart.current);

        let resultChat = [];
        let messagesBlockByDate = [];
        chatMessages.reduce((prevMessage, message) => {
            const isNewDate = chatMessages[0].id === message.id || moment(prevMessage.time).day() !== moment(message.time).day();
            if (isNewDate) {
                resultChat.push(<div key={ message.time }>{ messagesBlockByDate }</div>);
                messagesBlockByDate = [];
                messagesBlockByDate.push(getDateElement(message));
            }
            const isFirstMessageOfBlock = chatMessages[0].id === message.id || prevMessage.userId !== message.userId;
            const messageElement = getMessageElement(isFirstMessageOfBlock, message, lastReadMessage, lastMessage);
            messagesBlockByDate.push(messageElement);
            lastMessage.id === message.id && resultChat.push(<div key={ message.id }>{ messagesBlockByDate }</div>);
            return message
        }, {});
        return resultChat
    };

    return (
        <div className={ classes.chat_window } ref={ chatWindowRef } onScroll={ handleOnScroll }>
            { preloaderIsVisible && <Preloader type={ 'chat_window' }/> }
            <div className={ classes.chat_wrapper } ref={ chatWrapperRef } >
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
    interlocutor: PropTypes.object,
    communicationProcess: PropTypes.object,
    preloaderIsVisible: PropTypes.bool,
    changeMessageStatus: PropTypes.func,
    uploadChatMessages: PropTypes.func,
    togglePreloader: PropTypes.func
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(ChatWindow)