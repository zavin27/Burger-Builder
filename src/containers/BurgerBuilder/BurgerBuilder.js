import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';


const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.2,
  bacon: 0.7
};


class BurgerBuilder extends Component {
  
  state = {
    ingredients: null,
    totalPrice: 4,
    ingredientsOrder: [],
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  };
  
  componentDidMount() {
    axios.get('https://react-my-burger-builder-33479.firebaseio.com/ingredients.json')
      .then(response => {
        this.setState({ingredients: response.data});
      })
      .catch(error => {
        this.setState({error: true})
      })
  }
  
  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({
      ingredientsOrder: [...this.state.ingredientsOrder, type],
      totalPrice: newPrice,
      ingredients: updatedIngredients
    });
    this.updatePurchaseState(updatedIngredients)
  };
  
  calculateIngredientsAndPrice(type) {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients
    });
    this.updatePurchaseState(updatedIngredients)
    // console.log(this.state.ingredientsOrder)
  }
  
  removeIngredientHandler = (type) => {
    this.calculateIngredientsAndPrice(type);
  
    let lastTypeIndex = -1;
    for (let i = this.state.ingredientsOrder.length - 1; i >= 0; i--) {
      if (this.state.ingredientsOrder[i] === type) {
        lastTypeIndex = i;
        break;
      }
    }
    let updatedIngredientsOrder = [...this.state.ingredientsOrder];
  
    if (lastTypeIndex > -1) {
      updatedIngredientsOrder = updatedIngredientsOrder.filter((_, index) => lastTypeIndex !== index);
    }
  
    this.setState({ingredientsOrder: updatedIngredientsOrder});
    
  };
  
  removeIngredientOnClick = (type, index) => {
    this.calculateIngredientsAndPrice(type);
    
    let updatedIngredientsOrder = [...this.state.ingredientsOrder];
    
    updatedIngredientsOrder = updatedIngredientsOrder.filter((_, i) => index !== i)
    
    this.setState({
      ingredientsOrder: updatedIngredientsOrder
    });
    
  };
  
  
  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients).map(igKey => {
      return ingredients[igKey];
    }).reduce((sum, el) => {
      return sum + el;
    }, 0);
    this.setState({purchasable: sum > 0});
  }
  
  purchaseHandler = () => {
    this.setState({purchasing: true});
  };
  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  };
  purchaseContinueHandler = () => {
  
    const queryParams = [];
    for (let i in this.state.ingredientsOrder) {
      queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredientsOrder[i]))
    }
    queryParams.push('Price=' + this.state.totalPrice)
    const queryString = queryParams.join('&');
    this.props.history.push({
      pathname: '/checkout',
      search: '?' + queryString
    })
  };
  
  
  render() {
    
    const disabledInfo = {
      ...this.state.ingredients
    };
    
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
  
    let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner/>;
    let orderSummary = null;
  
    if (this.state.ingredients) {
      burger = (
        <Aux>
          <Burger
            ingredients={this.state.ingredients}
            ingredientsOrder={this.state.ingredientsOrder}
            removeIngredientOnClick={this.removeIngredientOnClick}
          />
          <BuildControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            ingredientPrice={INGREDIENT_PRICES}
            disabled={disabledInfo}
            price={this.state.totalPrice}
            purchasable={this.state.purchasable}
            purchasing={this.purchaseHandler}
          />
        </Aux>
      );
      orderSummary = (<OrderSummary
        ingredients={this.state.ingredients}
        price={this.state.totalPrice}
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

export default withErrorHandler(BurgerBuilder, axios);