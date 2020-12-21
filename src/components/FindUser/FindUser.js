import React from "react";
import classes from "./FindUser.module.sass"
import * as PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { Field, Form } from "react-final-form";
import UserItem from "./UserItem/UserItem";
import { v4 as uuidv4 } from "uuid";
import { addFoundUsers, searchUsers } from "../../redux/findUsers";
import { createNewDialog, onChangeCurrentDialog } from "../../redux/dialogsData/dialogsDataActions";
import { toggleElementVisibility } from "../../redux/displayMenu";
import { composeValidators, mustBePhoneNumber } from "../../common/Validators";

const FindUser = (props) => {
    const addNewDialog = (interlocutorId) => {
        props.toggleElementVisibility(false, false, false)
        const hasDialog = props.dialogs.find(d => d.members.find(m => m.id === interlocutorId) ? d.dialogId : null)
        if (hasDialog) {
            props.onChangeCurrentDialog(hasDialog.dialogId)
            props.history.push(`/${ hasDialog.dialogId }`)
        } else {
            const dialogId = uuidv4()
            props.createNewDialog(dialogId, props.currentUser.id, interlocutorId)
        }
    }

    const onChangeField = (value) => {
        const VALIDLENGTH = 7
        if (value && value.length > VALIDLENGTH) {
            props.searchUsers(value)
        } else {
            props.foundUsers.length && props.addFoundUsers([])
        }
    }

    const getUserItems = () => {
        if (props.foundUsers.length) {
            const filteredFoundUsers = props.foundUsers.filter(item => item.id !== props.currentUser.id);
            return filteredFoundUsers.map(item => <UserItem user={ item } addNewDialog={ addNewDialog } key={ item.id } />)
        }
    }

    const Textarea = ({ input, meta, ...rest }) => {
        return (
            <div>
                <textarea { ...input } { ...rest } onChange={(e) => {
                    input.onChange(e);
                    onChangeField(e.currentTarget.value)
                }} />
                <div className={ classes.error_message }>
                    { meta.error && <span>{ meta.error }</span> }
                </div>
            </div>
        )
    }

    return (
        <div className={ classes.find_user_menu_container }>
            <div className={ classes.find_user_header }>
                <span>Find user</span>
                <button className={ classes.close_button } onClick={ () => props.toggleElementVisibility(false, false, false) }>
                    Close
                </button>
            </div>
            <div className={ classes.search_form }>
                <Form onSubmit={ (data) => onChangeField(data.search) }>
                    { ({ handleSubmit }) => (
                        <form onSubmit={ handleSubmit } >
                            <Field component={ Textarea } name={ "search" }
                                   validate={ composeValidators(mustBePhoneNumber) }
                                   onKeyDown={ e => {
                                       if (e.key === 'Enter') {
                                           e.preventDefault()
                                           handleSubmit()
                                       }
                                   } }
                                   placeholder="Search by phone number..."
                            />
                        </form>
                    ) }
                </Form>
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
});

FindUser.propTypes = {
    dialogs: PropTypes.array,
    foundUsers: PropTypes.array,
    currentUser: PropTypes.object,
    addFoundUsers: PropTypes.func,
    searchUsers: PropTypes.func,
    onChangeCurrentDialog: PropTypes.func,
    toggleElementVisibility: PropTypes.func,
    createNewDialog: PropTypes.func
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(FindUser)