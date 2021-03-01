import React from 'react';
import classes from "../FindUserInput/FindUserInput.module.sass";

const FindUserInput = ({ input, meta, onSearchType }, { ...rest }) => {
    const moveCaretToEnd = (e) => {
        const temp_value = e.target.value;
        e.target.value = '';
        e.target.value = temp_value
    };

    return (
        <div className={ classes.find_user }>
            <textarea { ...input } { ...rest }
                      className={ classes.find_user_textarea }
                      autoFocus={ true }
                      onFocus={ moveCaretToEnd }
                      onKeyDown={ e => e.key === 'Enter' && e.preventDefault() }
                      onChange={ (e) => {
                          input.onChange(e);
                          !meta.error && onSearchType(e.currentTarget.value)
                      } }
            />
            <div className={ classes.error_message }>{ meta.error && <span>{ meta.error }</span> }</div>
        </div>
    )
};

export default FindUserInput