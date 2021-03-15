import React from 'react';
import classes from './UserDialogs.module.sass';
import * as PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import TheDialog from "./TheDialog/TheDialog";
import { connect } from "react-redux";
import { toggleChatPreloader } from "../../redux/preloader";
import { changeLastVisitTime } from "../../redux/dialogs/dialogsActions";

const UserDialogs = ({ dialogsData, currentUser, toggleChatPreloader, ...props }) => {

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
            dialog.messages.length && toggleChatPreloader(true);
            props.changeLastVisitTime(currentUser.id)
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
    toggleChatPreloader: (value) => dispatch(toggleChatPreloader(value)),
    changeLastVisitTime: (userId) => dispatch(changeLastVisitTime(userId))
});

UserDialogs.propTypes = {
    dialogsData: PropTypes.object,
    onChangeCurrentDialog: PropTypes.func,
    toggleChatPreloader: PropTypes.func,
    changeLastVisitTime: PropTypes.func,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(UserDialogs)