import React, {Component} from 'react';
import {Route} from 'react-router-dom';
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
  
  render() {
    console.log(this.props);
    return (
      <div>
        <CheckoutSummary
          ingredientsOrder={this.props.ingOrder}
          checkoutCancelled={this.checkoutCancelledHandler}
          checkoutContinued={this.checkoutContinuedHandler}/>
        <Route path={this.props.match.path + '/contact-data'}
               component={ContactData}/>
      </div>
    );
  }
  
}

const mapStateToProps = state => {
  return {
    ingOrder: state.ingredientsOrder,
  }
};


export default connect(mapStateToProps)(Checkout);