import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  }
};

export const authSuccess = (IdToken, localId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: IdToken,
    localId: localId
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  }
};

export const logOut = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('userId');
  return {
    type: actionTypes.AUTH_LOGOUT
  }
};

export const removeError = () => {
  return {
    type: actionTypes.REMOVE_ERROR
  }
};

export const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logOut());
    }, expirationTime * 1000);
  }
};

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  }
};

export const auth = (email, password, isSignUp) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    };
    let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyD1sW04Nc6vu1FG96bgBn-3E9OvyvKqI3Y';
    if (!isSignUp) {
      url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyD1sW04Nc6vu1FG96bgBn-3E9OvyvKqI3Y';
    }
    axios.post(url, authData)
      .then(response => {
        const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
        localStorage.setItem('token', response.data.idToken);
        localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('userId', response.data.localId);
        dispatch(authSuccess(response.data.idToken, response.data.localId));
        dispatch(checkAuthTimeout(response.data.expiresIn))
      })
      .catch(err => {
        dispatch(authFail(err.response.data.error));
      })
  }
};

export const checkAuthStatus = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token) {
      dispatch(logOut());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate > new Date()) {
        dispatch(authSuccess(token, userId));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000))
      } else {
        dispatch(logOut());
      }
    }
  }
};

export const resetPasswordStart = () => {
  return {
    type: actionTypes.RESET_PASSWORD_START
  }
};

export const resetPasswordSuccess = () => {
  return {
    type: actionTypes.RESET_PASSWORD_SUCCESS,
  }
};
export const resetPasswordFail = (error) => {
  return {
    type: actionTypes.RESET_PASSWORD_FAIL,
    error: error
  }
};

export const resetPassword = (email) => {
  return dispatch => {
    dispatch(resetPasswordStart());
    const resetData = {
      email: email,
      requestType: "PASSWORD_RESET"
    };
    axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode?key=AIzaSyD1sW04Nc6vu1FG96bgBn-3E9OvyvKqI3Y', resetData)
      .then(response => {
        dispatch(resetPasswordSuccess(response.data.email))
      })
      .catch(error => {
        dispatch(resetPasswordFail(error.response.data.error))
      })
  }
};

export const newPasswordStart = () => {
  return {
    type: actionTypes.NEW_PASSWORD_START
  }
};

export const newPasswordSuccess = () => {
  return {
    type: actionTypes.NEW_PASSWORD_SUCCESS,
  }
};
export const newPasswordFail = (error) => {
  return {
    type: actionTypes.NEW_PASSWORD_FAIL,
    error: error
  }
};

export const newPassword = (password, oobCode) => {
  return dispatch => {
    dispatch(newPasswordStart());
    const newData = {
      oobCode: oobCode,
      newPassword: password
    };
    axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/resetPassword?key=AIzaSyD1sW04Nc6vu1FG96bgBn-3E9OvyvKqI3Y', newData)
      .then(response => {
        console.log(response);
        dispatch(newPasswordSuccess());
      })
      .catch(error => {
        console.log(error);
        dispatch(newPasswordFail(error.response.data.error))
      })
  }
};

const verifyPasswordStart = () => {
  return {
    type: actionTypes.VERIFY_PASSWORD_START
  }
};

export const verifyPasswordSuccess = (oobCode) => {
  return {
    type: actionTypes.VERIFY_PASSWORD_SUCCESS,
    oobCode: oobCode
  }
};
export const verifyPasswordFail = (error) => {
  return {
    type: actionTypes.VERIFY_PASSWORD_FAIL,
    error: error
  }
};

export const verifyPassword = (oobCode) => {
  return dispatch => {
    dispatch(verifyPasswordStart());
    const verifyData = {
      oobCode: oobCode
    };
    axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/resetPassword?key=AIzaSyD1sW04Nc6vu1FG96bgBn-3E9OvyvKqI3Y', verifyData)
      .then(response => {
        console.log(response.data);
        dispatch(verifyPasswordSuccess(oobCode));
      })
      .catch(error => {
        console.log(error.message);
        dispatch(verifyPasswordFail(error.response.data.error))
      })
  };
};
