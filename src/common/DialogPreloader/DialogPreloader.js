import React from "react";
import preloader from '../../assets/preloader/Bean Eater-1s-200px.gif';
import classes from './DialogPreloader.module.sass'

const Preloader = (props) => {
    return (
        <div className={classes.preloader_wrapper}>
            <img src={preloader} alt="loading..."/>
        </div>
    )
}

export default Preloader