import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css'
import axios from '../../../axios-orders'
import Spinner from '../../../components/UI/Spinner/spinner';

class ContactData extends Component {
  state = {
    name: '',
    email: '',
    address: {
      street: '',
      postalCode: ''
    },
    loading: false
  };
  orderHandler = (event) => {
    event.preventDefault();
    this.setState({loading: true});
    const order = {
      ingredientsOrder: this.props.ingredientsOrder.length !== 0 ? this.props.ingredientsOrder : ['No ingredients'],
      totalPrice: this.props.totalPrice,
      customer: {
        name: 'Zavin Hussein',
        address: {
          street: 'testStreet 1',
          zipCode: 14325,
          country: 'Romania'
        },
        email: 'test@test.com',
      },
      deliveryMethod: 'Fastest'
    };
    
    axios.post('orders.json', order)
      .then(response => {
        this.setState({loading: false});
        this.props.history.push('/');
        
      })
      .catch(error => {
        this.setState({loading: false});
        console.log(error);
      });
    
    console.log(this.props.ingredientsOrder)
  };
  
  render() {
    let form = (
      <form>
        <input className={classes.Input} type="text" name='name' placeholder={'Your Name'}/>
        <input className={classes.Input} type="email" name='email' placeholder={'Your Email'}/>
        <input className={classes.Input} type="text" name='street' placeholder={'Street'}/>
        <input className={classes.Input} type="text" name='postalCode' placeholder={'Postal Code'}/>
        <Button btnType='Success' clicked={this.orderHandler}>ORDER</Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner/>;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter Your Contact Data</h4>
        {form}
      </div>
    )
  }
}

export default ContactData;