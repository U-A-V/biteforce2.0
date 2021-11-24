import createDataContext from './createDataContext';
import { navigate } from '../navigationRef';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-community/google-signin';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'add_error':
      return { ...state, errorMessage: action.payload };
    case 'signin':
      return { errorMessage: '', user: action.payload };
    case 'clear_error_message':
      return { ...state, errorMessage: '' };
    case 'signout':
      return { user: null, errorMessage: '' };
    default:
      return state;
  }
};

const tryLocalSignin = dispatch => async () => {
  auth().onAuthStateChanged((user) => {
    if (user) {
      dispatch({ type: 'signin', payload: user });
      navigate('Dashboard');
    } else {
      navigate('Signin');
    }
  })
  
};

const clearErrorMessage = dispatch => () => {
  dispatch({ type: 'clear_error_message' });
};

const signup = dispatch => async ({ email, password }) => {
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then((user) => {
      console.log('User account created & signed in!');
      dispatch({ type: 'signin', payload: user });
      navigate('Dashboard');
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
        dispatch({
          type: 'add_error',
          payload: 'That email address is already in use!'
        });
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
        dispatch({
          type: 'add_error',
          payload: 'That email address is invalid!'
        });
      }

      console.error(error);
    });
};

const signin = dispatch => async ({ email, password }) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then((user) => {
      console.log('User account created & signed in!');
      dispatch({ type: 'signin', payload: user });
      navigate('Dashboard');
    })
    .catch(error => {
      if (error.code === 'auth/wrong-password') {
        dispatch({
          type: 'add_error',
          payload: 'Wrong Password!'
        });
      } else if (error.code === 'auth/user-not-found') {
        dispatch({
          type: 'add_error',
          payload: 'Invalid email or password'
        });
      } else {
        dispatch({
          type: 'add_error',
          payload: 'Authentication Failed!'
        });
      }
      
      console.error(error);
    });
};

const googleSignin = dispatch => async () => {
  const { idToken } = await GoogleSignin.signIn();
  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  // Sign-in the user with the credential
  auth()
    .signInWithCredential(googleCredential)
    .then((user) => {
      console.log('User account created & signed in!');
      dispatch({ type: 'signin', payload: user });
      navigate('Dashboard');
    })
    .catch(error => {
      console.log(error)
    })
}

const signout = dispatch => async () => {
  try {
    await GoogleSignin.revokeAccess();
  } catch(err) {
    console.log(err);
  }
  auth()
    .signOut()
    .then(() => {
      console.log('User signed out!')
      dispatch({ type: 'signout' });
      navigate('loginFlow');
    });
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signout, signup, clearErrorMessage, tryLocalSignin, googleSignin },
  { user: null, errorMessage: '' }
);
