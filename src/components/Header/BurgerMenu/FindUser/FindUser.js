import React from "react";
import classes from "./FindUser.module.sass"
import { connect } from "react-redux";
import { toggleDarkBackgroundIsVisible, toggleFindUserMenuIsVisible } from "../../../../redux/displayMenu";
import { Field, Form } from "react-final-form";
import { addNewDialog, createDialog, createUserCurrentDialogs, searchByPhoneNumber } from "../../../../api/api";
import FoundUser from "./FoundUser/FoundUser";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

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
        const dialogId = uuidv4()
        createDialog(dialogId, this.props.currentUser.id, interlocutorId, moment().format())
            .then(() => {
                if (this.props.dialogs.length < 1) {
                    createUserCurrentDialogs(this.props.currentUser.id, dialogId)
                        .catch(error => console.log(error))
                } else {
                    addNewDialog(this.props.currentUser.id)
                        .update({ [dialogId]: dialogId })
                        .catch(error => console.log(error))
                }
            })
            .catch(error => console.log(error))
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

    onSubmit = (data) => !data.search && data.length < 9 ? this.setState({ arrUsers: [] }) : this.searchUsers(data.search)

    onChangeField = (value) => !value && value.length < 9 ? this.setState({ arrUsers: [] }) : this.searchUsers(value)

    getFoundUsers = () => {
        if (this.state.arrUsers.length > 0) {
            return this.state.arrUsers.map(item => item.id === this.props.currentUser.id ? <div /> :
                <FoundUser user={ item } addNewDialog={ this.addNewDialog } />)
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
                    <span>Create dialog</span>
                    <button className={ classes.close_button } onClick={ () => this.hideModalWindow() }>
                        Close
                    </button>
                </div>
                <div className={ classes.search_form }>
                    <Form onSubmit={ this.onSubmit }>
                        { ({ handleSubmit }) => (
                            <form onSubmit={ handleSubmit } >
                                <Field component={ this.Textarea } name={ "search" }
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
    toggleFindUserMenuIsVisible: (value) => { dispatch(toggleFindUserMenuIsVisible(value)) },
    toggleDarkBackgroundIsVisible: (value) => { dispatch(toggleDarkBackgroundIsVisible(value)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(FindUser)