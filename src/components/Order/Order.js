import React from 'react';
import classes from './Order.css';

const order = (props) => {
  
  const bacon = [];
  const cheese = [];
  const salad = [];
  const meat = [];
  
  props.ingredients.map(ingredient => {
    if (ingredient === 'bacon') {
      bacon.push(ingredient);
    } else if (ingredient === 'cheese') {
      cheese.push(ingredient);
    } else if (ingredient === 'salad') {
      salad.push(ingredient);
    } else if (ingredient === 'meat') {
      meat.push(ingredient);
    }
    return null;
  });
  const ingredients = 'Bacon ' + (bacon.length) + ", Cheese " + (cheese.length) + ", Salad " + (salad.length) + ", Meat " + (meat.length);
  
  return (
    <div className={classes.Order}>
      <p>Ingredients: {ingredients}</p>
      <p>Price <strong> ${Number.parseFloat(props.price).toFixed(2)}</strong></p>
    </div>
  );
};

export default order;
