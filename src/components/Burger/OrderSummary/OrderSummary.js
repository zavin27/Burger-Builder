import React from 'react';
import Aux from '../../../hoc/Aux';
import Button from '../../UI/Button/Button';

const orderSummary = (props) => {
  
  const ingredientSummary = Object.keys(props.ingredients)
    .map(igKey => {
      return (<li key={igKey}>
        <span style={{textTransform: 'capitalize'}}>{igKey}</span>: {props.ingredients[igKey]}x
        ({props.ingredientPrice[igKey]}$)
      </li>);
    });
  return (
    <Aux>
      <h3 style={{textAlign: 'center'}}>Your Order</h3>
      <p>A delicious Burger with the following ingredients:</p>
      <ul>
        {ingredientSummary}
      </ul>
      <p>Continue with checkout?</p>
      <p><strong>Total price: {props.price.toFixed(2)}$</strong></p>
      <div style={{textAlign: 'center'}}>
        <Button btnType={'Danger'} clicked={props.cancelledPurchase}>CANCEL</Button>
        <Button btnType={'Success'} clicked={props.continuedPurchase}>CONTINUE</Button>
      </div>
    
    </Aux>
  );
};

export default orderSummary;