import React from 'react';
import classes from './UserDialogs.module.sass';
import TheDialog from "./TheDialog/TheDialog";

const UserDialogs = (props) => {
    const modifyMessage = (message) => {
        if (typeof (message) === 'string') {
            if (message.length > 18) {
                const result = message.slice(0, 17) + '...'
                return result
            }
            return message
        }
    }

    const getLastMessage = (data) => {
        const dialog = Object.values(data)
        if (dialog.length > 0) {
            const lastDialogItem = dialog[dialog.length - 1]
            return {
                message: modifyMessage(lastDialogItem.message),
                time: lastDialogItem.time
            }
        }
        return {
            message: '',
            time: ''
        }
    }

    const getInterlocutor = (members) => members.find(m => m.id !== props.currentUser.id)

    return (
        <>
            { !props.currentUser ? <div /> :
                <div className={ classes.dialogs_container }>
                    <div className={ classes.dialogs }>
                        { props.dialogs.map(dialog => {
                                return (
                                    <TheDialog
                                        dialog={ dialog }
                                        getLastMessage={ getLastMessage }
                                        onChangeCurrentDialog={ props.onChangeCurrentDialog }
                                        currentDialog={ props.currentDialog }
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

export default UserDialogs