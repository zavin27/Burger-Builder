import React, {Component} from 'react';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {connect} from 'react-redux';

import Order from '../../components/Order/Order';
import * as actions from '../../store/actions/index'
import Spinner from '../../components/UI/Spinner/spinner';

class Orders extends Component {
  
  componentDidMount() {
    this.props.onFetchOrders(this.props.token, this.props.userId)
  }
  
  render() {
    let orders = <Spinner/>;
    if (!this.props.loading) {
      orders = (
        this.props.orders.map(order => (
          <Order
            key={order.id}
            ingredients={order.ingredientsOrder}
            price={order.totalPrice}/>
        ))
      )
    }
    return (
      <div>
        {orders}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    orders: state.orderReducer.orders,
    loading: state.orderReducer.loading,
    token: state.auth.token,
    userId: state.auth.userId
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));