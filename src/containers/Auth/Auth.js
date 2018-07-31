import React, {Component} from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import {Redirect, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import Spinner from '../../components/UI/Spinner/spinner';
import {updateObject, checkValidity} from "../../shared/utility";

class Auth extends Component {
  
  state = {
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: ''
        },
        label: 'Email address',
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
          placeholder: ''
        },
        label: 'Password',
        value: '',
        validation: {
          required: true,
          minLength: 6
          
        },
        valid: false,
        touched: false
      },
    },
    isSignUp: true,
  };
  
  componentDidMount() {
    if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
      this.props.onSetAuthRedirectPath();
    }
  }
  
  
  inputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(this.state.controls, {
      [controlName]: updateObject(this.state.controls[controlName], {
        value: event.target.value,
        valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
        touched: true
      })
    });
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
    const updatedControls = updateObject(this.state.controls, {
      email: updateObject(this.state.controls.email, {touched: false}),
      password: updateObject(this.state.controls.password, {touched: false}),
    
    });
    this.setState({controls: updatedControls});
    this.props.onErrorRemove()
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
        touched={formElement.config.touched}
        label={formElement.config.label}/>
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
  
    let authButtons = (
      <div>
        <div className={classes.Buttons}>
          <Button btnType="Success" type="submit" clicked={this.submitHandler}>SIGN IN</Button>
      
        </div>
        <div className={classes.bottomButton}>
          <span>Don't have an account?</span>
          <Button
            type='reset'
            clicked={this.switchAuthModeHandler}
            btnType='authBot'>SIGN UP NOW
          </Button>
        </div>
      </div>
    );
  
    if (this.state.isSignUp) {
      authButtons = (
        <div>
          <div className={classes.Buttons}>
            <Button btnType="Success" type="submit" clicked={this.submitHandler}>REGISTER</Button>
        
          </div>
          <div className={classes.bottomButton}>
            <span>Have an account?</span>
            <Button
              type='reset'
              clicked={this.switchAuthModeHandler}
              btnType='authBot'>SIGN IN NOW
            </Button>
          </div>
        </div>
      )
    }
    
    return (
      <div className={classes.Auth}>
        <div className={classes.SignIn}>
          <p className={classes.TopParagraph}>{this.state.isSignUp ? "Sign Up" : 'Sign In'} </p>
        </div>
        {isAuthenticated}
        <div className={classes.Container}>
          {error}
          <form>
            <div className={classes.formContainer}>
              {form}
            </div>
            <div className={classes.recoverContainer}>
              <Link to='/resetpassword' className={classes.recover}>Forgot your password?</Link>
            </div>
            {authButtons}
          </form>
        </div>
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
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/')),
    onErrorRemove: () => dispatch(actions.removeError())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);