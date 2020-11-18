import React from 'react';
import classes from './TheHeader.module.sass'
import BurgerMenu from "./BurgerMenu/BurgerMenu";

const TheHeader = () => {
    return (
        <header className={ classes.header }>
            <BurgerMenu/>
            <div className={ classes.logo }>
                <div className={ classes.logo_text }>Quick</div>
            </div>
        </header>
    )
}

export default TheHeader