import React from "react";
import classes from "./FindUser.module.sass"
import { connect } from "react-redux";
import { toggleDarkBackgroundIsVisible, toggleFindUserMenuIsVisible } from "../../../../redux/displayMenu";
import { Field, Form } from 'react-final-form'
import firebase from "firebase";

class FindUser extends React.Component {

    componentDidMount() {

        firebase
            .database()
            .ref('users')
            .orderByChild('name phoneNumber')
            .startAt('A')
            .endAt('A' + "\uf8ff")
            .once('value')
            .then((snapshot) =>  console.log(snapshot.val()))
    }

    onSubmit = (formData) => {
        console.log(formData);
    }

    searchUser = (e) => {
        console.log(e.currentTarget.value);
    }

    Textarea = ({input, meta, ...props}) => {
        return (
            <textarea { ...input } { ...props } onChange={ () => this.searchUser() } />
        )
    }

    render() {
        return (
            <div className={ classes.find_user_menu_container }>
                <div className={ classes.find_user_header }>
                    <span>Create dialog</span>
                    <button className={ classes.close_button } onClick={ () => {
                        this.props.toggleFindUserMenuIsVisible(false)
                        this.props.toggleDarkBackgroundIsVisible(false)
                    } }>
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
                                       placeholder="Search..."
                                />
                            </form>
                        ) }
                    </Form>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    toggleFindUserMenuIsVisible: (value) => { dispatch(toggleFindUserMenuIsVisible(value)) },
    toggleDarkBackgroundIsVisible: (value) => { dispatch(toggleDarkBackgroundIsVisible(value)) }
})

export default connect(null, mapDispatchToProps)(FindUser)