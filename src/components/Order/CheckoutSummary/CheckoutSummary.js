import React from 'react';

import Burger from '../../Burger/Burger';
import Button from '../../UI/Button/Button';
import classes from './CheckoutSummary.css'

const checkoutSummary = (props) => {
  return (
    <div className={classes.CheckoutSummary}>
      <h1>We hope it tastes well!</h1>
      <div style={{width: '100%', margin: 'auto'}}>
        <Burger
          ingredientsOrder={props.ingredientsOrder}
          removeIngredientOnClick={props.removeIngredientOnClick}
        />
      </div>
      <div className={classes.buttonContainer}>
        <Button btnType='orderDanger' clicked={props.checkoutCancelled}>CANCEL</Button>
        <Button btnType='orderSuccess' clicked={props.checkoutContinued}>CONTINUE</Button>
      </div>
    </div>
  )
};

export default checkoutSummary;