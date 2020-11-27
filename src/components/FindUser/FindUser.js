import React from "react";
import classes from "./FindUser.module.sass"
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

class FindUser extends React.Component {
    addNewDialog = (interlocutorId) => {
        this.props.toggleElementVisibility(false, false, false)
        const hasDialog = this.props.dialogs.find(d => d.members.find(m => m.id === interlocutorId) ? d.dialogId : null)
        if (hasDialog) {
            this.props.onChangeCurrentDialog(hasDialog.dialogId)
            this.props.history.push(`/${ hasDialog.dialogId }`)
        } else {
            const dialogId = uuidv4()
            this.props.createNewDialog(dialogId, this.props.currentUser.id, interlocutorId)
        }
    }

    onChangeField = (value) => {
        const VALIDLENGTH = 7
        if (value && value.length > VALIDLENGTH) {
            this.props.searchUsers(value)
        } else {
            this.props.foundUsers.length && this.props.addFoundUsers([])
        }
    }

    getUserItems = () => {
        if (this.props.foundUsers.length) {
            return this.props.foundUsers.map(item => item.id === this.props.currentUser.id ? '' :
                <UserItem user={ item } addNewDialog={ this.addNewDialog } key={ item.id } />)
        }
    }

    Textarea = ({ input, meta, ...rest }) => {
        return (
            <div>
                <textarea { ...input } { ...rest } onChange={(e) => {
                    input.onChange(e);
                    this.onChangeField(e.currentTarget.value)
                }} />
                <div className={ classes.error_message }>
                    { meta.error && <span>{ meta.error }</span> }
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className={ classes.find_user_menu_container }>
                <div className={ classes.find_user_header }>
                    <span>Find user</span>
                    <button className={ classes.close_button } onClick={ () => this.props.toggleElementVisibility(false, false, false) }>
                        Close
                    </button>
                </div>
                <div className={ classes.search_form }>
                    <Form onSubmit={ (data) => this.onChangeField(data.search) }>
                        { ({ handleSubmit }) => (
                            <form onSubmit={ handleSubmit } >
                                <Field component={ this.Textarea } name={ "search" }
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
                    { this.getUserItems() }
                </div>
            </div>
        )
    }
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