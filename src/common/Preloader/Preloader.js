import React from "react";
import preloader from '../../assets/preloader/Spinner-1s-200px.svg';
import classes from './Preloader.module.sass'

const Preloader = ({ isChatWindow }) => {
    return (
        <div className={ isChatWindow ? classes.chat_window_preloader_wrapper : classes.preloader_wrapper }>
            <img className={ classes.spinner } src={ preloader } alt="loading..." />
        </div>
    )
}

export default Preloader