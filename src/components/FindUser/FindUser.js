import React from "react";
import classes from "./FindUser.module.sass"
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import UserItem from "./UserItem/UserItem";
import { v4 as uuidv4 } from "uuid";
import { addFoundUsers, searchUsers } from "../../redux/findUsers";
import { createNewDialog, onChangeCurrentDialog } from "../../redux/dialogsData/dialogsDataActions";
import { toggleElementVisibility } from "../../redux/displayMenu";
import { mustBePhoneNumber } from "../../common/Validators";
import InputForm from "../../common/InputForm/InputForm";

const FindUser = (props) => {

    const addNewDialog = (interlocutorId) => {
        props.toggleElementVisibility(false, false, false);
        const hasDialog = props.dialogs.find(d => d.members.find(m => m.id === interlocutorId) ? d.dialogId : null);
        if (hasDialog) {
            props.onChangeCurrentDialog(hasDialog.dialogId);
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
            return props.foundUsers.map(item => item.id === props.currentUser.id ? '' :
                <UserItem user={ item } addNewDialog={ addNewDialog } key={ item.id } />)
        }
    };

    return (
        <div className={ classes.find_user_menu_container }>
            <div className={ classes.find_user_header }>
                <span>Find user</span>
                <button className={ classes.close_button } onClick={ () => props.toggleElementVisibility(false, false, false) }>
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
    dialogs: state.dialogsDataReducer.dialogs,
    foundUsers: state.findUsers.foundUsers,
    currentUser: state.dialogsDataReducer.currentUser
})

const mapDispatchToProps = (dispatch) => ({
    addFoundUsers: (foundUsers) => { dispatch(addFoundUsers(foundUsers)) },
    searchUsers: (value) => { dispatch(searchUsers(value)) },
    onChangeCurrentDialog: (dialogId) => { dispatch(onChangeCurrentDialog(dialogId)) },
    toggleElementVisibility: (menuIsVisible, findUserMenuIsVisible, darkBackgroundIsVisible) => {
        dispatch(toggleElementVisibility(menuIsVisible, findUserMenuIsVisible, darkBackgroundIsVisible))
    },
    createNewDialog: (dialogId, currentUserId, interlocutorId) => dispatch(createNewDialog(dialogId, currentUserId, interlocutorId))
})

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(FindUser)