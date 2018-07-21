import React, {Component} from 'react';
import {Route} from 'react-router-dom';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
  
  state = {
    ingredientsOrder: null,
    totalPrice: 4
    
  };
  
  componentWillMount() {
    const query = new URLSearchParams(this.props.location.search);
    const ingredientsOrder = [];
    let price = 0;
    for (let param of query.entries()) {
      if (param[0] === 'Price') {
        price = param[1]
      } else {
        ingredientsOrder[param[0]] = param[1]
      }
      
    }
    this.setState({ingredientsOrder: ingredientsOrder, totalPrice: price})
    
  }
  
  checkoutCancelledHandler = () => {
    this.props.history.goBack();
  };
  checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data');
  };
  
  render() {
    console.log(this.props);
    return (
      <div>
        <CheckoutSummary
          ingredientsOrder={this.state.ingredientsOrder}
          checkoutCancelled={this.checkoutCancelledHandler}
          checkoutContinued={this.checkoutContinuedHandler}/>
        <Route path={this.props.match.path + '/contact-data'} render={(props) => (
          <ContactData ingredientsOrder={this.state.ingredientsOrder}
                       totalPrice={this.state.totalPrice} {...props}/>)}/>
      </div>
    );
  }
  
}

export default Checkout;