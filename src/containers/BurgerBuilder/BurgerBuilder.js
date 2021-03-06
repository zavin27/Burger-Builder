import React, {Component} from 'react';
import {connect} from 'react-redux';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';




class BurgerBuilder extends Component {
  
  state = {
    purchasing: false,
  };
  
  componentDidMount() {
    this.props.onInitIngredients()
  }
  
  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients).map(igKey => {
      return ingredients[igKey];
    }).reduce((sum, el) => {
      return sum + el;
    }, 0);
    return sum > 0;
  }
  
  purchaseHandler = () => {
    if (this.props.isAuthenticated) {
      this.setState({purchasing: true});
    } else {
      this.props.onSetAuthRedirectPath('/checkout');
      this.props.history.push('/auth')
    }
    
  };
  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  };
  purchaseContinueHandler = () => {
    this.props.onInitPurchase();
    this.props.history.push('/checkout');
  
  };
  
  
  render() {
    
    const disabledInfo = {
      ...this.props.ings
    };
    
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
  
    let burger = this.props.error ? <p>Ingredients can't be loaded</p> : <Spinner/>;
    let orderSummary = null;
  
    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger
            ingredients={this.props.ings}
            ingredientsOrder={this.props.ingsOrder}
            removeIngredientOnClick={this.props.onIngredientClickedRemoved}
          />
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            ingredientPrice={this.props.ingsPrices}
            disabled={disabledInfo}
            price={this.props.price}
            purchasable={this.updatePurchaseState(this.props.ings)}
            purchasing={this.purchaseHandler}
            isAuth={this.props.isAuthenticated}
          />
        </Aux>
      );
      orderSummary = (<OrderSummary
        ingredients={this.props.ings}
        price={this.props.price}
        ingredientPrice={this.props.ingsPrices}
        cancelledPurchase={this.purchaseCancelHandler}
        continuedPurchase={this.purchaseContinueHandler}
      />);
    }
    
    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      
      </Aux>
    
    );
  }
  
  
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    ingsOrder: state.burgerBuilder.ingredientsOrder,
    ingsPrices: state.burgerBuilder.ingredientsPrices,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    purchased: state.orderReducer.purchased,
    isAuthenticated: state.auth.token != null,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
    onIngredientClickedRemoved: (ingName, index) => dispatch(actions.removeIngredientOnClick(ingName, index)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));