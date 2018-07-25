import * as actionTypes from './actions';

const initialState = {
  ingredients: {
    salad: 0,
    cheese: 0,
    meat: 0,
    bacon: 0
  },
  ingredientsOrder: [],
  totalPrice: 4
};

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.2,
  bacon: 0.7
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [action.ingredientName]: state.ingredients[action.ingredientName] + 1
        },
        ingredientsOrder: [...state.ingredientsOrder, action.ingredientName],
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName]
      };
    case actionTypes.REMOVE_INGREDIENT:
      
      let lastTypeIndex = -1;
      for (let i = state.ingredientsOrder.length - 1; i >= 0; i--) {
        if (state.ingredientsOrder[i] === action.ingredientName) {
          lastTypeIndex = i;
          break;
        }
      }
      let updatedIngredientsOrder = [...state.ingredientsOrder];
      
      if (lastTypeIndex > -1) {
        updatedIngredientsOrder = updatedIngredientsOrder.filter((_, index) => lastTypeIndex !== index);
      }
      
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [action.ingredientName]: state.ingredients[action.ingredientName] - 1
        },
        ingredientsOrder: updatedIngredientsOrder,
        totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName]
      };
    case actionTypes.REMOVE_INGREDIENT_ON_CLICK:
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [action.ingredientName]: state.ingredients[action.ingredientName] - 1
        },
        ingredientsOrder: [...state.ingredientsOrder].filter((_, i) => action.index !== i),
        totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName]
        
      };
    default:
      return state;
  }
};


export default reducer;