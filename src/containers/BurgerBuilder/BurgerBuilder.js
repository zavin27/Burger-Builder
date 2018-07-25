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
import * as actionType from '../../store/actions';


const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.2,
  bacon: 0.7
};


class BurgerBuilder extends Component {
  
  state = {
    ingredientsOrder: [],
    purchasing: false,
    loading: false,
    error: false
  };
  
  componentDidMount() {
    // axios.get('https://react-my-burger-builder-33479.firebaseio.com/ingredients.json')
    //   .then(response => {
    //     this.setState({ingredients: response.data});
    //   })
    //   .catch(error => {
    //     this.setState({error: true})
    //   })
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
    this.setState({purchasing: true});
  };
  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  };
  purchaseContinueHandler = () => {
    this.props.history.push('/checkout');
  };
  
  
  render() {
    
    const disabledInfo = {
      ...this.props.ings
    };
    
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
  
    let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner/>;
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
            ingredientPrice={INGREDIENT_PRICES}
            disabled={disabledInfo}
            price={this.props.price}
            purchasable={this.updatePurchaseState(this.props.ings)}
            purchasing={this.purchaseHandler}
          />
        </Aux>
      );
      orderSummary = (<OrderSummary
        ingredients={this.props.ings}
        price={this.props.price}
        ingredientPrice={INGREDIENT_PRICES}
        cancelledPurchase={this.purchaseCancelHandler}
        continuedPurchase={this.purchaseContinueHandler}
      />);
    }
  
    if (this.state.loading) {
      orderSummary = <Spinner/>;
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
    ings: state.ingredients,
    ingsOrder: state.ingredientsOrder,
    price: state.totalPrice
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch({type: actionType.ADD_INGREDIENT, ingredientName: ingName}),
    onIngredientRemoved: (ingName) => dispatch({type: actionType.REMOVE_INGREDIENT, ingredientName: ingName}),
    onIngredientClickedRemoved: (ingName, index) => dispatch({
      type: actionType.REMOVE_INGREDIENT_ON_CLICK,
      ingredientName: ingName,
      index: index
    })
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));