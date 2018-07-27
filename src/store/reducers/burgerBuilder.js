import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility';

const initialState = {
  ingredients: null,
  ingredientsOrder: [],
  ingredientsPrices: {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.2,
    bacon: 0.7
  },
  totalPrice: 4,
  error: false
};

const addIngredient = (state, action) => {
  const updatedIngredient = {[action.ingredientName]: state.ingredients[action.ingredientName] + 1};
  const updatedIngredients = updateObject(state.ingredients, updatedIngredient);
  const updatedState = {
    ingredients: updatedIngredients,
    ingredientsOrder: [...state.ingredientsOrder, action.ingredientName],
    totalPrice: state.totalPrice + state.ingredientsPrices[action.ingredientName]
  };
  return updateObject(state, updatedState);
};
const removeIngredient = (state, action) => {
  let lastTypeIndex = -1;
  for (let i = state.ingredientsOrder.length - 1; i >= 0; i--) {
    if (state.ingredientsOrder[i] === action.ingredientName) {
      lastTypeIndex = i;
    }
  }
  let updatedIngredientsOrder = [...state.ingredientsOrder];
  if (lastTypeIndex > -1) {
    updatedIngredientsOrder = updatedIngredientsOrder.filter((_, index) => lastTypeIndex !== index);
  }
  const updatedIng = {[action.ingredientName]: state.ingredients[action.ingredientName] - 1};
  const updatedIngs = updateObject(state.ingredients, updatedIng);
  const updatedSt = {
    ingredients: updatedIngs,
    ingredientsOrder: updatedIngredientsOrder,
    totalPrice: state.totalPrice - state.ingredientsPrices[action.ingredientName]
  };
  return updateObject(state, updatedSt);
};
const removeIngredientOnClick = (state, action) => {
  const updatedIngien = {[action.ingredientName]: state.ingredients[action.ingredientName] - 1};
  const updatedIngiens = updateObject(state.ingredients, updatedIngien);
  return updateObject(state, {
    ingredients: updatedIngiens,
    ingredientsOrder: [...state.ingredientsOrder].filter((_, i) => action.index !== i),
    totalPrice: state.totalPrice - state.ingredientsPrices[action.ingredientName]
  });
};
const setIngredients = (state, action) => {
  return updateObject(state, {
    ingredients: action.ingredients,
    ingredientsOrder: [],
    totalPrice: 4,
    error: false
  });
};
const fetchIngredientsFailed = (state, action) => {
  return updateObject(state, {error: true});
};


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      return addIngredient(state, action);
    case actionTypes.REMOVE_INGREDIENT:
      return removeIngredient(state, action);
    case actionTypes.REMOVE_INGREDIENT_ON_CLICK:
      return removeIngredientOnClick(state, action);
    case actionTypes.SET_INGREDIENTS:
      return setIngredients(state, action);
    case actionTypes.FETCH_INGREDIENTS_FAILED:
      return fetchIngredientsFailed(state, action);
    default:
      return state;
  }
};


export default reducer;