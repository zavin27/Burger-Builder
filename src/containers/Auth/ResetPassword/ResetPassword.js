import React, {Component} from 'react'
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import classes from './ResetPassword.css';
import {updateObject, checkValidity} from "../../../shared/utility";
import {connect} from 'react-redux';
import {resetPassword} from "../../../store/actions";


class ResetPassword extends Component {
  state = {
    elementType: 'input',
    type: 'email',
    label: 'Email address',
    value: '',
    validation: {
      required: true,
      isEmail: true
    },
    valid: false,
    touched: false,
  };
  
  
  inputChangedHandler = (event) => {
    const updatedState = updateObject(this.state, {
      value: event.target.value,
      valid: checkValidity(event.target.value, this.state.validation),
      touched: true
    });
    
    this.setState(updatedState);
  };
  
  submitHandler = (event) => {
    event.preventDefault();
    this.props.onPasswordReset(this.state.value);
    this.setState(updateObject(this.state, {resetPasswordSent: true}))
  };
  
  
  render() {
  
  
    return (
      <div className={classes.Auth}>
        <div className={classes.SignIn}>
          <p className={classes.TopParagraph}>Reset Password </p>
        </div>
        <div className={classes.Container}>
          <form>
            <div className={classes.formContainer}>
              <Input
                key={this.state.label}
                elementtype={this.state.elementType}
                elementconfig={this.state.type}
                value={this.state.value}
                changed={(event) => this.inputChangedHandler(event)}
                invalid={!this.state.valid}
                shouldValidate={this.state.validation}
                touched={this.state.touched}
                label={this.state.label}/>
            </div>
            <div>
              <div className={classes.Buttons}>
                <Button btnType="Success" type="submit" disabled={!this.state.valid} clicked={this.submitHandler}>Reset
                  Password</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onPasswordReset: (email) => dispatch(resetPassword(email))
  }
};

export default connect(null, mapDispatchToProps)(ResetPassword);