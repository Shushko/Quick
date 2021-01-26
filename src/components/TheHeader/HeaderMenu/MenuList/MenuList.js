import React from 'react';
import classes from './MenuList.module.sass';
import search from "../../../../assets/search.png";
import exit from "../../../../assets/exit.png";

const MenuList = (props) => {
    return (
        <div className={ classes.menu_list }>
            <div className={ classes.menu_list_item }
                 onClick={ () => props.toggleFindUserMenuVisibility(false, true, !props.isMobileVersion, 'Search users') }>
                <div className={ classes.menu_list_item_button }>
                    <img src={ search }/>
                    <span>Search users</span>
                </div>
            </div>
            <div className={ classes.menu_list_item } onClick={ props.handleLogOutUser }>
                <div className={ classes.menu_list_item_button }>
                    <img src={ exit }/>
                    <span>Log Out</span>
                </div>
            </div>
        </div>
    )
};

export default MenuList