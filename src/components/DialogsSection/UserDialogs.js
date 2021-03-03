import React from 'react';
import classes from './UserDialogs.module.sass';
import * as PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import TheDialog from "./TheDialog/TheDialog";
import { connect } from "react-redux";
import { togglePreloader } from "../../redux/preloader";

const UserDialogs = ({ dialogsData, currentUser, togglePreloader, ...props }) => {

    const currentDialogId = props.match.params.dialogId;

    const getLastMessage = (dialogMessages) => {
        if (dialogMessages.length) {
            const lastDialogItem = dialogMessages[dialogMessages.length - 1];
            return {
                message: lastDialogItem.message,
                time: lastDialogItem.time,
                userName: lastDialogItem.userId === currentUser.id ? 'You' : lastDialogItem.userName
            }
        }
    };

    const changeDialog = (dialog) => {
        if (currentDialogId !== dialog.dialogId) {
            dialog.messages.length && togglePreloader(true);
        }
    };

    const getInterlocutor = (members) => members.find(m => m.id !== currentUser.id);

    const sortDialogsByTime = (dialogs) => {
        return dialogs.length > 1 ?
            [...dialogs].sort((a, b) => {
                const timeA = a.messages.length ? getLastMessage(a.messages).time : a.dateOfCreation;
                const timeB = b.messages.length ? getLastMessage(b.messages).time : b.dateOfCreation;
                return timeA > timeB ? -1 : 1
            }) : dialogs;
    };

    return (
        <div className={ classes.dialogs_container }>
            <div className={ classes.dialogs }>
                { sortDialogsByTime(dialogsData.dialogs).map(dialog => {
                        return (
                            <TheDialog
                                dialog={ dialog }
                                lastMessage={ getLastMessage(dialog.messages) }
                                currentDialogId={ currentDialogId }
                                interlocutor={ getInterlocutor(dialog.members) }
                                handleDialogClick={ changeDialog }
                                key={ dialog.dialogId }
                            />
                        )
                    }
                ) }
            </div>
        </div>
    )
};

const mapStateToProps = (state) => ({
    dialogsData: state.dialogsReducer,
    currentUser: state.userProfile.currentUser
});

const mapDispatchToProps = (dispatch) => ({
    togglePreloader: (value) => dispatch(togglePreloader(value))
});

UserDialogs.propTypes = {
    dialogsData: PropTypes.object,
    onChangeCurrentDialog: PropTypes.func,
    togglePreloader: PropTypes.func,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(UserDialogs)