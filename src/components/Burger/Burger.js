import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from "./BurgerIngredient/BurgerIngredient";


const burger = (props) => {
  let transformedIngredients = props.ingredientsOrder.map((igKey, i) => {
    return <BurgerIngredient type={igKey} key={igKey + i}
                             remove={(type, index) => props.removeIngredientOnClick(type, index)} index={i}/>;
  });
  
  if (transformedIngredients.length === 0) {
    transformedIngredients = <p>Please start adding ingredients!</p>
  }
  
  
  return (
    <div className={classes.Burger}>
      <BurgerIngredient type='bread-top'/>
      {transformedIngredients}
      <BurgerIngredient type='bread-bottom'/>
    
    </div>
  );
};

export default burger;