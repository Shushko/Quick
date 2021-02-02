import React from 'react';
import classes from './UserDialogs.module.sass';
import * as PropTypes from 'prop-types';
import TheDialog from "./TheDialog/TheDialog";
import moment from "moment";
import { connect } from "react-redux";
import { onChangeCurrentDialog } from "../../redux/dialogsData/dialogsDataActions";
import { togglePreloader } from "../../redux/preloader";

const UserDialogs = ({ dialogsData, onChangeCurrentDialog, togglePreloader }) => {

    const getLastMessage = (data) => {
        const dialog = Object.values(data);
        if (dialog.length > 0) {
            const lastDialogItem = dialog[dialog.length - 1];
            return {
                message: lastDialogItem.message,
                time: moment(lastDialogItem.time).format('LT')
            }
        }
        return {
            message: '',
            time: ''
        }
    };

    const changeDialog = (dialog) => {
        if (dialogsData.currentDialog !== dialog.dialogId) {
            dialog.messages.length && togglePreloader(true);
            onChangeCurrentDialog(dialog.dialogId);
        }
    };

    const getInterlocutor = (members) => members.find(m => m.id !== dialogsData.currentUser.id);

    return (
        <div className={ classes.dialogs_container }>
            <div className={ classes.dialogs }>
                { dialogsData.dialogs.map(dialog => {
                        return (
                            <TheDialog
                                dialog={ dialog }
                                getLastMessage={ getLastMessage }
                                currentDialog={ dialogsData.currentDialog }
                                getInterlocutor={ getInterlocutor }
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
    dialogsData: state.dialogsDataReducer
});

const mapDispatchToProps = (dispatch) => ({
    onChangeCurrentDialog: (value) => dispatch(onChangeCurrentDialog(value)),
    togglePreloader: (value) => dispatch(togglePreloader(value))
});

UserDialogs.propTypes = {
    dialogsData: PropTypes.object,
    onChangeCurrentDialog: PropTypes.func,
    togglePreloader: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserDialogs)