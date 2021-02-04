import React from "react";
import classes from "./FindUser.module.sass"
import * as PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import UserItem from "./UserItem/UserItem";
import { v4 as uuidv4 } from "uuid";
import { addFoundUsers, searchUsers } from "../../redux/findUsers";
import { createNewDialog } from "../../redux/dialogsData/dialogsDataActions";
import { mustBePhoneNumber } from "../../common/Validators";
import InputForm from "../../common/InputForm/InputForm";
import { hideAllModalWindows } from "../../redux/displayModalElements";

const FindUser = (props) => {
    const addNewDialog = (interlocutorId) => {
        props.hideAllModalWindows();
        const hasDialog = props.dialogs.find(d => d.members.find(m => m.id === interlocutorId) ? d.dialogId : null);
        if (hasDialog) {
            props.history.push(`/${ hasDialog.dialogId }`)
        } else {
            const dialogId = uuidv4();
            props.createNewDialog(dialogId, props.currentUser.id, interlocutorId)
        }
    };

    const onChangeField = (value) => {
        const VALID_LENGTH = 7;
        if (value && value.length > VALID_LENGTH) {
            props.searchUsers(value)
        } else {
            props.foundUsers.length && props.addFoundUsers([])
        }
    };

    const getUserItems = () => {
        if (props.foundUsers.length) {
            const filteredFoundUsers = props.foundUsers.filter(item => item.id !== props.currentUser.id);
            return filteredFoundUsers.map(item => <UserItem user={ item } addNewDialog={ addNewDialog } key={ item.id } />)
        }
    };

    return (
        <div className={ classes.find_user_menu_container }>
            <div className={ classes.find_user_header }>
                <span>Search users</span>
                <button className={ classes.close_button } onClick={ () => props.hideAllModalWindows() }>
                    Close
                </button>
            </div>
            <div className={ classes.search_form }>

                <InputForm
                    formType={ 'find_user' }
                    inputName={ 'search' }
                    onSubmit={ onChangeField }
                    validators={ [mustBePhoneNumber] }
                    placeholder={ "Search by phone number..." }
                />
            </div>
            <div className={ classes.found_users_container }>
                { getUserItems() }
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    isMobileVersion: state.appState.isMobileVersion,
    dialogs: state.dialogsDataReducer.dialogs,
    foundUsers: state.findUsers.foundUsers,
    currentUser: state.userProfile.currentUser
})

const mapDispatchToProps = (dispatch) => ({
    addFoundUsers: (foundUsers) => { dispatch(addFoundUsers(foundUsers)) },
    searchUsers: (value) => { dispatch(searchUsers(value)) },
    createNewDialog: (dialogId, currentUserId, interlocutorId) => dispatch(createNewDialog(dialogId, currentUserId, interlocutorId)),
    hideAllModalWindows: () => dispatch(hideAllModalWindows()),
});

FindUser.propTypes = {
    isMobileVersion: PropTypes.bool,
    dialogs: PropTypes.array,
    foundUsers: PropTypes.array,
    currentUser: PropTypes.object,
    addFoundUsers: PropTypes.func,
    searchUsers: PropTypes.func,
    hideAllModalWindows: PropTypes.func,
    createNewDialog: PropTypes.func
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(FindUser)