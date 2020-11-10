import React from "react";
import classes from "./FindUser.module.sass"
import { connect } from "react-redux";
import { toggleDarkBackgroundIsVisible, toggleFindUserMenuIsVisible } from "../../../../redux/displayMenu";
import { Field, Form } from "react-final-form";
import {
    createDialog,
    getRefCurrentDialogs,
    searchByPhoneNumber
} from "../../../../api/api";
import FoundUser from "./FoundUser/FoundUser";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { onChangeCurrentDialog } from "../../../../redux/dialogsData/dialogsDataActions";
import { withRouter } from "react-router-dom";
import { composeValidators, mustBeFormat, mustBePhoneNumber } from "../../../../common/Validators";

class FindUser extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            arrUsers: []
        }
    }

    hideModalWindow = () => {
        this.props.toggleFindUserMenuIsVisible(false)
        this.props.toggleDarkBackgroundIsVisible(false)
    }

    addNewDialog = (interlocutorId) => {
        this.hideModalWindow()
        const hasDialog = this.props.dialogs.find(d => d.members.find(m => m.id === interlocutorId) ? d.dialogId : null)
        if (hasDialog) {
            this.props.onChangeCurrentDialog(hasDialog.dialogId)
            this.props.history.push(`/${ hasDialog.dialogId }`)
        } else {
            const dialogId = uuidv4()
            createDialog(dialogId, this.props.currentUser.id, interlocutorId, moment().format())
                .then(() => {
                    getRefCurrentDialogs(this.props.currentUser.id)
                        .update({ [dialogId]: dialogId })
                        .catch(error => console.log(error))
                })
                .then(() => {
                    this.props.onChangeCurrentDialog(dialogId)
                    this.props.history.push(`/${ dialogId }`)
                })
                .catch(error => console.log(error))
        }
    }

    searchUsers = (value) => {
        searchByPhoneNumber()
            .startAt(value)
            .endAt(value + "\uf8ff")
            .once('value')
            .then(data =>  {
                if (data.val()) {
                    const foundUsers = Object.values(data.val())
                    this.setState({ arrUsers: foundUsers })
                } else { this.setState({ arrUsers: [] }) }
            })
    }

    onChangeField = (value) => value && value.length > 7 ? this.searchUsers(value) : this.setState({ arrUsers: [] })

    getFoundUsers = () => {
        if (this.state.arrUsers.length) {
            return this.state.arrUsers.map(item => item.id === this.props.currentUser.id ? <div key={ item.id } /> :
                <FoundUser user={ item } addNewDialog={ this.addNewDialog } key={ item.id } />)
        }
    }

    Textarea = ({ input, meta, ...rest }) => {
        return <textarea { ...input } { ...rest } onChange={(e) => {
            input.onChange(e);
            this.onChangeField(e.currentTarget.value)
        }} />
    }

    render() {
        return (
            <div className={ classes.find_user_menu_container }>
                <div className={ classes.find_user_header }>
                    <span>Find user</span>
                    <button className={ classes.close_button } onClick={ () => this.hideModalWindow() }>
                        Close
                    </button>
                </div>
                <div className={ classes.search_form }>
                    <Form onSubmit={ (data) => this.onChangeField(data.search) }>
                        { ({ handleSubmit }) => (
                            <form onSubmit={ handleSubmit } >
                                <Field component={ this.Textarea } name={ "search" }
                                       validate={ composeValidators(mustBeFormat, mustBePhoneNumber) }
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
                    { this.getFoundUsers() }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    dialogs: state.dialogsDataReducer.dialogs,
    currentUser: state.currentUser.currentUser
})

const mapDispatchToProps = (dispatch) => ({
    onChangeCurrentDialog: (value) => { dispatch(onChangeCurrentDialog(value)) },
    toggleFindUserMenuIsVisible: (value) => { dispatch(toggleFindUserMenuIsVisible(value)) },
    toggleDarkBackgroundIsVisible: (value) => { dispatch(toggleDarkBackgroundIsVisible(value)) }
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FindUser))