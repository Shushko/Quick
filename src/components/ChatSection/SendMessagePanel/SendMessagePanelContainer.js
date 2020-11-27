import React from 'react';
import SendMessagePanel from "./SendMessagePanel";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

class SendMessagePanelContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dialog: null,
            interlocutor: null
        }
    }

    componentDidUpdate() {
        if (!this.state.dialog || this.state.dialog.dialogId !== this.props.dialogsData.currentDialog) {
            const dialog = this.props.dialogsData.dialogs.find(d => d.dialogId === this.props.dialogsData.currentDialog)
            const interlocutor = dialog && this.findInterlocutor(dialog)
            this.setState({ dialog, interlocutor })
        }
    }

    findInterlocutor = (dialog) => dialog.members.find(m => m.id !== this.props.dialogsData.currentUser.id)

    onSubmit = (formData) => this.props.addNewMessage(
        this.state.interlocutor.id,
        uuidv4(),
        this.props.dialogsData.currentDialog,
        this.props.dialogsData.currentUser.id,
        moment().format(),
        formData.message
    )

    render() {
        return (
            <SendMessagePanel
                currentUser={ this.props.dialogsData.currentUser }
                interlocutor={ this.state.interlocutor }
                currentDialog={ this.props.dialogsData.currentDialog }
                onSubmit={ this.onSubmit }
            />
        )
    }
}

export default SendMessagePanelContainer