import React from 'react';
import SendMessagePanel from "./SendMessagePanel";
import { connect } from "react-redux";
import { addNewMessage } from "../../../redux/dialogsData/dialogsDataActions";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { compose } from "redux";
import { withRouter } from "react-router-dom";

const SendMessagePanelContainer = (props) => {
    const findInterlocutor = () => {
        const dialog = props.dialogsData.dialogs.find(dialog => dialog.dialogId === props.dialogsData.currentDialog)
        return dialog ? dialog.members.find(m => m.id !== props.currentUser.id) : {}
    }

    const onSubmit = (formData) => {
        props.addNewMessage(
            uuidv4(),
            props.dialogsData.currentDialog,
            props.currentUser.id,
            moment().format(),
            formData.message
        )
    }

    return (
        <>
            {
                !props.dialogsData.currentDialog ? <div/> :
                    <SendMessagePanel
                        currentUser={ props.currentUser }
                        interlocutor={ findInterlocutor() }
                        currentDialog={ props.dialogsData.currentDialog }
                        onChangeInput={ props.onChangeInput }
                        onSubmit={ onSubmit }
                    />
            }
        </>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.dialogsDataReducer.currentUser,
    dialogsData: state.dialogsDataReducer
})

const mapDispatchToProps = (dispatch) => ({
    addNewMessage: (messageId, dialogId, userId, time, inputValue) => { dispatch(addNewMessage(messageId, dialogId, userId, time, inputValue)) }
})

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(SendMessagePanelContainer)