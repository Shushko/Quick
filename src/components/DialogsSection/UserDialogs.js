import React from 'react';
import classes from './UserDialogs.module.sass';
import TheDialog from "./TheDialog/TheDialog";
import moment from "moment";
import { connect } from "react-redux";
import { onChangeCurrentDialog } from "../../redux/dialogsData/dialogsDataActions";

const UserDialogs = ({ dialogsData, onChangeCurrentDialog }) => {
    const modifyMessage = (message) => {
        if (typeof (message) === 'string') {
            const VALIDLENGTH = 18;
            if (message.length > VALIDLENGTH) {
                const result = message.slice(0, 17) + '...';
                return result
            }
            return message
        }
    }

    const getLastMessage = (data) => {
        const dialog = Object.values(data);
        if (dialog.length > 0) {
            const lastDialogItem = dialog[dialog.length - 1];
            return {
                message: modifyMessage(lastDialogItem.message),
                time: moment(lastDialogItem.time).format('LT')
            }
        }
        return {
            message: '',
            time: ''
        }
    };

    const getInterlocutor = (members) => members.find(m => m.id !== dialogsData.currentUser.id);

    return (
        <>
            { !dialogsData.currentUser ? <div/> :
                <div className={ classes.dialogs_container }>
                    <div className={ classes.dialogs }>
                        { dialogsData.dialogs.map(dialog => {
                                return (
                                    <TheDialog
                                        dialog={ dialog }
                                        getLastMessage={ getLastMessage }
                                        onChangeCurrentDialog={ onChangeCurrentDialog }
                                        currentDialog={ dialogsData.currentDialog }
                                        getInterlocutor={ getInterlocutor }
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

const mapStateToProps = (state) => ({
    dialogsData: state.dialogsDataReducer
})

const mapDispatchToProps = (dispatch) => ({
    onChangeCurrentDialog: (value) => { dispatch(onChangeCurrentDialog(value)) },
})

export default connect(mapStateToProps, mapDispatchToProps)(UserDialogs)