import React from 'react';
import { Field, Form } from "react-final-form";
import classes from "../../components/FindUser/FindUser.module.sass";
import { composeValidators, mustBePhoneNumber } from "../Validators";

const InputForm = ({ onChangeField, placeholder }) => {

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
    };

    return (
        <Form onSubmit={ (data) => onChangeField(data.search) }>
            { ({ handleSubmit }) => (
                <form onSubmit={ handleSubmit } >
                    <Field component={ Textarea } name={ "search" }
                           validate={ composeValidators(mustBePhoneNumber) }
                           onKeyDown={ e => {
                               if (e.key === 'Enter') {
                                   e.preventDefault();
                                   handleSubmit()
                               }
                           } }
                           placeholder={ placeholder }
                    />
                </form>
            ) }
        </Form>
    )
};

export default InputForm