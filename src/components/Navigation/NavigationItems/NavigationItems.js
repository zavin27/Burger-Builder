import React from 'react';
import Navigationitem from './NavigationItem/NavigationItem';
import classes from './NavigationItems.css';

const navigationItems = (props) => (
  <ul className={classes.NavigationItems}>
    <Navigationitem link={'/'}>Burger Builder</Navigationitem>
    <Navigationitem link={'/orders'}>Orders</Navigationitem>
  </ul>

);

export default navigationItems;