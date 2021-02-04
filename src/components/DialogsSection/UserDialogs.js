import React from 'react';
import classes from './UserDialogs.module.sass';
import * as PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import TheDialog from "./TheDialog/TheDialog";
import moment from "moment";
import { connect } from "react-redux";
import { togglePreloader } from "../../redux/preloader";

const UserDialogs = ({ dialogsData, currentUser, togglePreloader, ...props }) => {

    const currentDialogId = props.match.params.dialogId;

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
        if (currentDialogId !== dialog.dialogId) {
            dialog.messages.length && togglePreloader(true);
        }
    };

    const getInterlocutor = (members) => members.find(m => m.id !== currentUser.id);

    return (
        <div className={ classes.dialogs_container }>
            <div className={ classes.dialogs }>
                { dialogsData.dialogs.map(dialog => {
                        return (
                            <TheDialog
                                dialog={ dialog }
                                getLastMessage={ getLastMessage }
                                currentDialogId={ currentDialogId }
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
    dialogsData: state.dialogsDataReducer,
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