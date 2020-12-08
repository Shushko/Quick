import React from 'react'

const StartText = () => {
    const startTextWrap = {
        weight: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }

    const startTextStyle = {
        fontWeight: 'bold',
        fontSize: '1.1em',
        color: '#adadad'
    }

    const START_TEXT = 'Select a dialog and start communication'

    return (
        <div style={ startTextWrap }>
            <span style={ startTextStyle }>{ START_TEXT }</span>
        </div>
    )
}

export default StartText