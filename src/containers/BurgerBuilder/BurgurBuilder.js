import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import Burgur from '../../components/Burger/Burgur';

class BurgurBuilder extends Component {
  
  state = {
    ingredients: {
      salad: 1,
      bacon: 1,
      cheese: 2,
      meat: 2
    }
  }
  
  render() {
    return(
      <Aux>
        <Burgur ingredients = {this.state.ingredients}/>
        <div>Build Controller</div>
      </Aux>
  
    );
  }
  
  
}

export default BurgurBuilder;