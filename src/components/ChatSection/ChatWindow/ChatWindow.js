import React from 'react';
import classes from './ChatWindow.module.sass';
import ChatItem from "./ChatItem/ChatItem";
import arrowDown from '../../../assets/arrow.png'

class ChatWindow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lastItemIsVisible: false
        }
        this.currentVisibleChat = null
        this.dialog = null
        this.messageUserId = null
        this.lastItem = null
        this.messagesEnd = React.createRef()
        this.observer = null
        this.visibleElement = null
        this.arrRefs = [];
    }

    componentDidMount() {
        if (this.dialog) { this.scrollToEnd() }
    }

    componentDidUpdate() {
        this.arrRefs = this.arrRefs.filter(i => i.ref)
        if (this.dialog && this.arrRefs.length > 0) {
            this.observer = new IntersectionObserver(this.observerCbFn, { threshold: 1 })
            this.setObserver()
            this.scrollToEnd()
        }
    }

    scrollToEnd = () => {
        let isNewDialog = null
        if (this.dialog.dialog) {
            isNewDialog = !this.dialog.dialog.length || this.dialog.dialog.every(i => i.userId !== this.props.currentUser.id)
        }

        if (this.currentVisibleChat === this.props.match.params.dialogId || isNewDialog) {
            if (this.state.lastItemIsVisible) { this.messagesEnd.current.scrollIntoView({ block: 'end' }) }
        }  else {
            const arr = this.arrRefs.filter(i => i.message.isRead || (!i.message.isRead && i.message.userId === this.props.currentUser.id))
            arr[arr.length - 1].ref.scrollIntoView({ block: 'end' })
        }
        this.currentVisibleChat = this.props.match.params.dialogId
    }

    scrollDown = () => {
        this.messagesEnd.current.scrollIntoView({ block: "end", behavior: "smooth" })
    }

    observerCbFn = entries => {
        entries.forEach(entry => {
            if (entry.target === this.lastItem.ref) {
                if (entry.isIntersecting) {
                    if (!this.state.lastItemIsVisible) { this.setState({ lastItemIsVisible: true }) }
                } else {
                    if (this.state.lastItemIsVisible) { this.setState({ lastItemIsVisible: false }) }
                }
            }
            if (entry.isIntersecting) {
                if (this.visibleElement !== entry.target) { this.visibleElement = entry.target } else { return }
                const visibleMessage = this.arrRefs.find(item => item.ref === entry.target)
                if (!visibleMessage.message.isRead && visibleMessage.message.userId !== this.props.currentUser.id) {
                    this.observer.unobserve(entry.target)
                    this.props.changeMessageStatus(visibleMessage.dialogId, visibleMessage.message, true, true)
                }
            }
        })
    }

    setObserver = () => {
        for (let item of this.arrRefs) {
            if (item === this.arrRefs[this.arrRefs.length - 1]) {
                this.lastItem = item
            }
            this.observer.observe(item.ref)
        }
    }

    getUserChat = () => {
        this.dialog = this.props.dialogsState.dialogs.find(dialog => dialog.dialogId === this.props.match.params.dialogId)
        if (!this.dialog) { return [] }
        const interlocutor = this.dialog.members.find(m => m.id !== this.props.currentUser.id)
        const resultDialog = this.dialog.dialog.map((item, index) => {
            const chatItem =
                <div key={ item.id } ref={ ref => {
                    this.arrRefs[index] = {
                        ref: ref,
                        message: item,
                        dialogId: this.dialog.dialogId
                    }
                } }>
                    <ChatItem
                        messageUserId={ this.messageUserId }
                        item={ item }
                        interlocutor={ interlocutor }
                        currentUser={ this.props.currentUser }
                        modifyTime={ this.modifyTime }
                    />
                </div>

            this.messageUserId = item.userId
            return chatItem
        })

        this.messageUserId = null
        return resultDialog
    }

    render() {
        return (
            <div className={ classes.chats_window }>
                {
                    !this.props.match.params.dialogId ?
                        <span className={ classes.start_text }>Select a dialog and start communication</span> :

                        <div className={ classes.chat_wrapper }>
                            { this.getUserChat() }
                            <div className={ classes.end_block } ref={ this.messagesEnd }/>
                        </div>
                }

                {
                    !this.state.lastItemIsVisible && this.props.match.params.dialogId ?
                        <div className={ classes.arrowDown_wrap }>
                            {
                                this.dialog && this.dialog.unreadMessages ?
                                    <span className={ classes.sum_unread_messages }>{ this.dialog.unreadMessages }</span> : <div/>
                            }
                            <img src={ arrowDown } className={ classes.arrow_down } onClick={ this.scrollDown } alt=""/>
                        </div> : <div/>
                }
            </div>
        )
    }
}

export default ChatWindow