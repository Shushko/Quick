import React from 'react';
import SendMessagePanel from "./SendMessagePanel";
import { connect } from "react-redux";
import { addNewMessage, onChangeInput } from "../../../redux/dialogsData/dialogsDataActions";

const SendMessagePanelContainer = (props) => {

    const findInterlocutor = () => {
        const dialog = props.dialogsData.dialogs.find(dialog => dialog.dialogId === props.dialogsData.currentDialog)
        return dialog ? dialog.members.find(m => m.id !== props.currentUser.id) : {}
    }

    return (
        <>
            {
                !props.currentUser ? <div/> :
                    <SendMessagePanel
                        currentUser={ props.currentUser }
                        interlocutor={ findInterlocutor() }
                        inputValue={ props.dialogsData.inputValue }
                        currentDialog={ props.dialogsData.currentDialog }
                        onChangeInput={ props.onChangeInput }
                        addNewMessage={ props.addNewMessage }
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

export default connect(mapStateToProps, mapDispatchToProps)(SendMessagePanelContainer)