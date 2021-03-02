import React from 'react';
import { Field, Form } from "react-final-form";
import { composeValidators } from "../Validators";
import { withRouter } from "react-router-dom";
import SendMessageInput from "./InputFieldTypes/SendMessageInput/SendMessageInput";
import FindUserInput from "./InputFieldTypes/FindUserInput/FindUserInput";
import AuthUserInput from "./InputFieldTypes/AuthUserInput/AuthUserInput";
import EditUserInput from "./InputFieldTypes/EditUserInput/EditUserInput";

const Textarea = (props) => {

    switch (props.formType) {
        case 'send_message_panel':
            return <SendMessageInput { ...props } />;

        case 'find_user':
            return <FindUserInput { ...props } />;

        case 'auth_user':
            return <AuthUserInput { ...props } />;

        case 'edit_user_name':
            return <EditUserInput { ...props } />;
    }
};

const InputForm = (props) => {
    return (
        <Form onSubmit={ props.onSubmit } initialValues={{ edit_user_name: props.currentUserName }}>
            { ({ handleSubmit, pristine, form }) => {
                props.currentDialogId && form.change(props.currentDialogId, form.getState().values[props.currentDialogId]);

                const onSearchType = (value) => !pristine && handleSubmit(value);

                const onClickSubmit = (event) => {
                    event.preventDefault();
                    if (!pristine) {
                        handleSubmit();
                        form.reset();
                    }
                };

                return (
                    <form onSubmit={ event => onClickSubmit(event) }>
                        <Field component={ Textarea }
                               name={ props.inputName }
                               validate={ props.validators && composeValidators(...props.validators) }
                               placeholder={ props.placeholder }
                               isInvalidNumber={ props.isInvalidNumber }
                               numberFormIsVisible={ props.numberFormIsVisible }
                               formType={ props.formType }
                               isMobileVersion={ props.isMobileVersion }
                               hideInput={ props.hideInput }
                               onSearchType={ onSearchType }
                               onClickSubmit={ onClickSubmit }
                        />
                    </form>
                )
            } }
        </Form>
    )
};

export default withRouter(InputForm)