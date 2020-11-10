import React from 'react';
import SendMessagePanel from "./SendMessagePanel";
import { connect } from "react-redux";
import { addNewMessage } from "../../../redux/dialogsData/dialogsDataActions";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { getRefCurrentDialogs } from "../../../api/api";

class SendMessagePanelContainer extends React.Component {
    constructor(props) {
        super(props)
        this.dialog = null
    }

    findInterlocutor = () => {
        this.dialog = this.props.dialogsData.dialogs.find(dialog => dialog.dialogId === this.props.dialogsData.currentDialog)
        return this.dialog ? this.dialog.members.find(m => m.id !== this.props.currentUser.id) : {}
    }

    onSubmit = (formData) => {
        if (this.dialog.dialog.length < 1) {
            getRefCurrentDialogs(this.findInterlocutor().id)
                .update({ [this.dialog.dialogId]: this.dialog.dialogId })
                .catch(error => console.log(error))
        }

        this.props.addNewMessage(
            uuidv4(),
            this.props.dialogsData.currentDialog,
            this.props.currentUser.id,
            moment().format(),
            formData.message
        )
    }

    render() {
        return (
            <>
                {
                    !this.props.dialogsData.currentDialog ? <div/> :
                        <SendMessagePanel
                            currentUser={ this.props.currentUser }
                            interlocutor={ this.findInterlocutor() }
                            currentDialog={ this.props.dialogsData.currentDialog }
                            onSubmit={ this.onSubmit }
                        />
                }
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.dialogsDataReducer.currentUser,
    dialogsData: state.dialogsDataReducer
})

const mapDispatchToProps = (dispatch) => ({
    addNewMessage: (messageId, dialogId, userId, time, inputValue) => { dispatch(addNewMessage(messageId, dialogId, userId, time, inputValue)) }
})

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(SendMessagePanelContainer)