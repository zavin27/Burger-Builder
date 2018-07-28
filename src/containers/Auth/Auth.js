import React, {Component} from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import Spinner from '../../components/UI/Spinner/spinner';

class Auth extends Component {
  
  state = {
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Mail Address'
        },
        value: '',
        validation: {
          required: true,
          isEmail: true
          
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password'
        },
        value: '',
        validation: {
          required: true,
          minLength: 6
          
        },
        valid: false,
        touched: false
      },
    },
    isSignUp: true
  };
  
  componentDidMount() {
    if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
      this.props.onSetAuthRedirectPath();
    }
  }
  
  checkValidity = (value, rules) => {
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }
    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid
    }
    
    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid
    }
    return isValid;
  };
  
  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
        touched: true
      }
    };
    this.setState({controls: updatedControls});
    
  };
  
  submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp)
  };
  
  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return {isSignUp: !prevState.isSignUp}
    });
  };
  
  
  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key]
      })
    }
    let form = formElementsArray.map(formElement => (
      <Input
        key={formElement.id}
        elementtype={formElement.config.elementType}
        elementconfig={formElement.config.elementConfig}
        value={formElement.config.value}
        changed={(event) => this.inputChangedHandler(event, formElement.id)}
        invalid={!formElement.config.valid}
        shouldValidate={formElement.config.validation}
        touched={formElement.config.touched}/>
    ));
    if (this.props.loading) {
      form = <Spinner/>
    }
    
    let error = null;
    if (this.props.error) {
      switch (this.props.error.message) {
        case 'EMAIL_NOT_FOUND':
          error = (<p>'You have entered an invalid Email address or password'</p>);
          break;
        case 'INVALID_PASSWORD':
          error = (<p>'You have entered an invalid Email address or password'</p>);
          break;
        case 'USER_DISABLED':
          error = (<p>'The user account has been disabled by an administrator'</p>);
          break;
        case 'EMAIL_EXISTS':
          error = (<p>'The Email address is already in use'</p>);
          break;
        case 'OPERATION_NOT_ALLOWED':
          error = (<p>'Password sign-in is disabled for this project'</p>);
          break;
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          error = (<p>'We have blocked all requests from this device due to unusual activity. Try again later'</p>);
          break;
        case 'INVALID_EMAIL':
          error = (<p>'You have entered an invalid Email Address'</p>);
          break;
        case 'WEAK_PASSWORD':
          error = (<p>'Password should be at least 6 characters'</p>);
          break;
        default:
          error = (<p>{this.props.error.message}</p>);
          break;
        
        // work in progress
      }
    }
    let isAuthenticated = null;
    if (this.props.isAuthenticated) {
      isAuthenticated = <Redirect to={this.props.authRedirectPath}/>
    }
    
    return (
      <div className={classes.Auth}>
        {isAuthenticated}
        {error}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType="Success">SUBMIT</Button>
        </form>
        <Button
          clicked={this.switchAuthModeHandler}
          btnType='Danger'>SWITCH TO {this.state.isSignUp ? 'SIGN IN' : 'SIGN UP'}</Button>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token != null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);