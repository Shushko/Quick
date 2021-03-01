import React from 'react';
import classes from "../AuthUserInput/AuthUserInput.module.sass";

const AuthUserInput = ({ input, meta, isInvalidNumber, onClickSubmit }, { ...rest }) => {

    return (
        <div className={ classes.auth_user }>
            <textarea { ...input } { ...rest }
                      className={ classes.auth_user_textarea }
                      autoFocus={ true }
                      onKeyDown={ e => {
                          if (e.key === 'Enter') {
                              !meta.error ? onClickSubmit(e) : e.preventDefault();
                          }
                      } }
            />
            <button className={ classes.auth_user_button } onClick={ e => !meta.error && onClickSubmit(e) }>Send</button>
            <div className={ classes.error_message }>
                { isInvalidNumber && !meta.modified && !meta.touched && <span>Invalid number</span> }
                { meta.error && meta.error !== 'Required field' && <span>{ meta.error }</span> }
                { meta.error === 'Required field' && meta.touched && !meta.active && <span>{ meta.error }</span> }
            </div>
        </div>
    )
};

export default AuthUserInput