import React, { Component } from 'react';
import classes from './UserDialogs.module.sass';
import TheDialog from "./TheDialog/TheDialog";
import moment from "moment";
import { connect } from "react-redux";
import { onChangeCurrentDialog } from "../../redux/dialogsData/dialogsDataActions";

class UserDialogs extends Component {
    modifyMessage = (message) => {
        if (typeof (message) === 'string') {
            const VALIDLENGTH = 18
            if (message.length > VALIDLENGTH) {
                const result = message.slice(0, 17) + '...'
                return result
            }
            return message
        }
    }

    getLastMessage = (data) => {
        const dialog = Object.values(data)
        if (dialog.length > 0) {
            const lastDialogItem = dialog[dialog.length - 1]
            return {
                message: this.modifyMessage(lastDialogItem.message),
                time: moment(lastDialogItem.time).format('LT')
            }
        }
        return {
            message: '',
            time: ''
        }
    }

    getInterlocutor = (members) => members.find(m => m.id !== this.props.dialogsData.currentUser.id)

    render() {
        return (
            <>
                { !this.props.dialogsData.currentUser ? <div/> :
                    <div className={ classes.dialogs_container }>
                        <div className={ classes.dialogs }>
                            { this.props.dialogsData.dialogs.map(dialog => {
                                    return (
                                        <TheDialog
                                            dialog={ dialog }
                                            getLastMessage={ this.getLastMessage }
                                            onChangeCurrentDialog={ this.props.onChangeCurrentDialog }
                                            currentDialog={ this.props.dialogsData.currentDialog }
                                            getInterlocutor={ this.getInterlocutor }
                                            key={ dialog.dialogId }
                                        />
                                    )
                                }
                            ) }
                        </div>
                    </div> }
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    dialogsData: state.dialogsDataReducer
})

const mapDispatchToProps = (dispatch) => ({
    onChangeCurrentDialog: (value) => { dispatch(onChangeCurrentDialog(value)) },
})

export default connect(mapStateToProps, mapDispatchToProps)(UserDialogs)