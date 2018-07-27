import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
  
  
  checkoutCancelledHandler = () => {
    this.props.history.goBack();
  };
  checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data');
  };
  burgerIngredientClickHandler = () => {
  };
  
  render() {
    let summary = <Redirect to='/'/>;
    const purchasedRedirect = this.props.purchased ? <Redirect to='/'/> : null;
    if (this.props.ings) {
      summary = (
        <div>
          {purchasedRedirect}
          <CheckoutSummary
            ingredientsOrder={this.props.ingOrder}
            checkoutCancelled={this.checkoutCancelledHandler}
            checkoutContinued={this.checkoutContinuedHandler}
            removeIngredientOnClick={this.burgerIngredientClickHandler}/>
          <Route path={this.props.match.path + '/contact-data'}
                 component={ContactData}/>
        </div>
      )
    }
    return summary;
  }
  
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    ingOrder: state.burgerBuilder.ingredientsOrder,
    purchased: state.orderReducer.purchased,
  }
};


export default connect(mapStateToProps)(Checkout);