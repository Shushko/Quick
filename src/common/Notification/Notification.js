import React from "react";
import * as PropTypes from 'prop-types';
import classes from './Notification.module.sass'

const Notification = ({ content }) => {
    return (
        <div className={ classes.notification_wrapper }>
            <div>{ content }</div>
        </div>
    )
};

Notification.propTypes = {
    content: PropTypes.string
};

export default Notification