import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import * as actions from '../../../store/actions/index';

class Logout extends Component {
  
  componentDidMount() {
    this.props.onlogout();
  }
  
  render() {
    
    return <Redirect to='/'/>
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onlogout: () => dispatch(actions.logOut())
  }
};

export default connect(null, mapDispatchToProps)(Logout);