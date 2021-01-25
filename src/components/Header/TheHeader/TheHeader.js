import React from 'react';
import classes from './TheHeader.module.sass'
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import TheLogo from "../../../common/TheLogo/TheLogo";

const TheHeader = () => {
    return (
        <header className={ classes.header }>
            <BurgerMenu/>
            <div className={ classes.header_logo }><TheLogo /></div>
        </header>
    )
}

export default TheHeader