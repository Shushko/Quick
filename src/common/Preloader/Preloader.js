import React from "react";
import preloader from '../../assets/preloader/Spinner-1s-200px.svg';
import classes from './Preloader.module.sass'

const Preloader = (props) => {
    return (
        <div className={classes.preloader_wrapper}>
            <img src={preloader} alt="loading..." />
        </div>
    )
}

export default Preloader