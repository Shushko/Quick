import React from 'react';
import SendMessagePanel from "./SendMessagePanel";
import { connect } from "react-redux";
import { addNewMessage, onChangeInput } from "../../../redux/dialogsData/dialogsDataActions";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { compose } from "redux";
import { withRouter } from "react-router-dom";

const SendMessagePanelContainer = (props) => {

    const findInterlocutor = () => {
        const dialog = props.dialogsData.dialogs.find(dialog => dialog.dialogId === props.dialogsData.currentDialog)
        return dialog ? dialog.members.find(m => m.id !== props.currentUser.id) : {}
    }

    const sendMessage = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            props.addNewMessage(
                uuidv4(),
                props.dialogsData.currentDialog,
                props.currentUser.id,
                moment().format(),
                props.dialogsData.inputValue)
        }
    }

    return (
        <>
            {
                !props.dialogsData.currentDialog ? <div/> :
                    <SendMessagePanel
                        currentUser={ props.currentUser }
                        interlocutor={ findInterlocutor() }
                        inputValue={ props.dialogsData.inputValue }
                        currentDialog={ props.dialogsData.currentDialog }
                        onChangeInput={ props.onChangeInput }
                        sendMessage={sendMessage}
                    />
            }
        </>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.dialogsDataReducer.currentUser,
    dialogsData: state.dialogsDataReducer,
    inputValue: state.dialogsDataReducer.inputValue
})

const mapDispatchToProps = (dispatch) => ({
    onChangeInput: (e) => { dispatch(onChangeInput(e.currentTarget.value)) },
    addNewMessage: (messageId, dialogId, userId, time, inputValue) => { dispatch(addNewMessage(messageId, dialogId, userId, time, inputValue)) }
})

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(SendMessagePanelContainer)