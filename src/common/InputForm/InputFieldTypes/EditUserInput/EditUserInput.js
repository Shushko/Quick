import React, { useRef } from 'react';
import classes from "../EditUserInput/EditUserInput.module.sass";

const EditUserInput = ({ input, meta, onClickSubmit, hideInput, isMobileVersion }, { ...rest }) => {
    const editNameFormRef = useRef(null);

    return (
        <div className={ classes.edit_user_name } ref={ editNameFormRef }>
            <textarea { ...input } { ...rest }
                      className={ classes.edit_user_name_textarea }
                      onBlur={ () => setTimeout(hideInput, 0) }
                      autoFocus={ true }
                      onKeyDown={ e => {
                          if (e.key === 'Enter') {
                              !meta.error ? onClickSubmit(e) : e.preventDefault();
                          }
                      } }
            />
            { isMobileVersion &&
            <button className={ classes.edit_user_name_button } onClick={ e => !meta.error && onClickSubmit(e) }>Save</button> }

            <div className={ classes.error_message }>
                { meta.error && <span>{ meta.error }</span> }
            </div>
        </div>
    )
};

export default EditUserInput