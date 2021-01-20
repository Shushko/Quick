import React from "react";
import * as PropTypes from 'prop-types';
import preloader from '../../assets/preloader/Spinner-1s-200px.svg';
import classes from './Preloader.module.sass'

const Preloader = ({ type }) => {
    return (
        <div className={ classes[type] }>
            <img className={ classes.spinner } src={ preloader } alt="loading..." />
        </div>
    )
};

Preloader.propTypes = {
    type: PropTypes.string
};

export default Preloader