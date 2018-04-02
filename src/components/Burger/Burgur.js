import React from 'react';
import classes from './Burgur.css';
import BurgurIngredient from "./BurgurIngredient/BurgurIngredient";


const burgur = (props) => {
  const transformedIngredients = Object.keys(props.ingredients).map(igKey => {
    return [...Array(props.ingredients[igKey])].map((_ , i) => {
      return <BurgurIngredient type={igKey} key={igKey + i}/>;
    });
  });
  
  return(
    <div className={classes.Burgur}>
      <BurgurIngredient type='bread-top'/>
      {transformedIngredients}
      <BurgurIngredient type='bread-bottom'/>
      
    </div>
  );
};

export default burgur;