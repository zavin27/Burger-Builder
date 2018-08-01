import * as actionTypes from '../actions/actionTypes';

import {updateObject} from "../../shared/utility";

const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  authRedirectPath: '/',
  oobCode: null,
};

const authStart = (state, action) => {
  return updateObject(state, {error: null, loading: true});
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    token: action.idToken,
    userId: action.localId,
    error: null,
    loading: false
  })
};
const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  })
};

const authLogOut = (state, action) => {
  return updateObject(state, {
    token: null,
    userId: null
  })
};

const setAuthRedirectPath = (state, action) => {
  return updateObject(state, {authRedirectPath: action.path})
};

const removeError = (state, action) => {
  return updateObject(state, {error: null})
};

const resetPasswordStart = (state, action) => {
  return updateObject(state, {error: null, loading: true})
};

const resetPasswordSuccess = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false
  })
};

const resetPasswordFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  })
};
const newPasswordStart = (state, action) => {
  return updateObject(state, {error: null, loading: true})
};

const newPasswordSuccess = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false
  })
};

const newPasswordFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  })
};
const verifyPasswordStart = (state, action) => {
  return updateObject(state, {error: null, loading: true})
};

const verifyPasswordSuccess = (state, action) => {
  return updateObject(state, {
    oobCode: action.oobCode,
    error: null,
    loading: false
  })
};

const verifyPasswordFail = (state, action) => {
  return updateObject(state, {
    // error: action.error,
    goodCode: false,
    loading: false
  })
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogOut(state, action);
    case actionTypes.SET_AUTH_REDIRECT_PATH:
      return setAuthRedirectPath(state, action);
    case actionTypes.REMOVE_ERROR:
      return removeError(state, action);
    case actionTypes.RESET_PASSWORD_START:
      return resetPasswordStart(state, action);
    case actionTypes.RESET_PASSWORD_SUCCESS:
      return resetPasswordSuccess(state, action);
    case actionTypes.RESET_PASSWORD_FAIL:
      return resetPasswordFail(state, action);
    case actionTypes.NEW_PASSWORD_START:
      return newPasswordStart(state, action);
    case actionTypes.NEW_PASSWORD_SUCCESS:
      return newPasswordSuccess(state, action);
    case actionTypes.NEW_PASSWORD_FAIL:
      return newPasswordFail(state, action);
    case actionTypes.VERIFY_PASSWORD_START:
      return verifyPasswordStart(state, action);
    case actionTypes.VERIFY_PASSWORD_SUCCESS:
      return verifyPasswordSuccess(state, action);
    case actionTypes.VERIFY_PASSWORD_FAIL:
      return verifyPasswordFail(state, action);
    default:
      return state;
  }
};

export default reducer;