import React, {Component} from 'react'
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import classes from './NewPassword.css';
import {updateObject, checkValidity} from "../../../shared/utility";
import {connect} from 'react-redux';
import Spinner from '../../../components/UI/Spinner/spinner';
import {newPassword, verifyPassword} from "../../../store/actions";
import {Redirect} from 'react-router-dom';


class NewPassword extends Component {
  state = {
    controls: {
      PasswordOne: {
        elementType: 'input',
        type: 'password',
        label: 'New password',
        value: '',
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false,
      },
      PasswordTwo: {
        elementType: 'input',
        type: 'password',
        label: 'Re-type new password',
        value: '',
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false,
      },
    },
  };
  
  componentDidMount() {
    
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams.get('mode'));
    console.log(urlParams.get('oobCode'));
    
    //oobCode here
    this.props.onVerifyPassword(urlParams.get('oobCode'))
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
    this.props.onNewPassword(this.state.controls.PasswordOne.value, this.props.code);
    this.props.history.push('/');
  };
  
  
  render() {
    const isValid = this.state.controls.PasswordOne.value !== this.state.controls.PasswordTwo.value;
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
    
    
    return (
      <div className={classes.Auth}>
        <div className={classes.SignIn}>
          <p className={classes.TopParagraph}>Reset Password </p>
        </div>
        <div className={classes.Container}>
          <form>
            <div className={classes.formContainer}>
              {form}
            </div>
            <div>
              <div className={classes.Buttons}>
                <Button btnType="Success" type="submit" disabled={isValid} clicked={this.submitHandler}>CHANGE</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    code: state.auth.oobCode,
    err: state.auth.error,
    loading: state.auth.loading
  }
};
const mapDispatchToProps = dispatch => {
  return {
    onNewPassword: (password, oobCode) => dispatch(newPassword(password, oobCode)),
    onVerifyPassword: (oobCode) => dispatch(verifyPassword(oobCode))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(NewPassword);