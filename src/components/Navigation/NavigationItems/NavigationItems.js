import React from 'react';
import Navigationitem from './NavigationItem/NavigationItem';
import classes from './NavigationItems.css';

const navigationItems = (props) => (
  <ul className={classes.NavigationItems}>
    <Navigationitem link={'/'}>Burger Builder</Navigationitem>
    {props.isAuth ? <Navigationitem link={'/orders'}>Orders</Navigationitem> : null}
    {props.isAuth ? <Navigationitem link={'/logout'}>Sign Out</Navigationitem> :
      <Navigationitem link={'/auth'}>Sign in</Navigationitem>}
  </ul>

);

export default navigationItems;