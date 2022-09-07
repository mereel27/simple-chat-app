import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { app } from './firebaseConfig';
import { addUser } from './firebaseFirestore';

export const auth = getAuth();

export const signInWithEmail = async (email, password) => {
  auth.useDeviceLanguage();
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

export const logout = (e) => {
  e.preventDefault();
  signOut(auth)
    .then((response) => {
      // Sign-out successful.
      console.log(response);
    })
    .catch((error) => {
      // An error happened.
    });
};

export const createUser = async (email, password) => {
  try {
    try { 
      await createUserWithEmailAndPassword(auth, email, password).then((response) => console.log(response)); 
    } finally {
      const { email, phoneNumber, metadata: {createdAt}, uid, displayName, photoURL } = auth.currentUser;
      const data = {email, phoneNumber, createdAt, uid, displayName, photoURL, channel: '' };
      await addUser(uid, data);
    }
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
    // ..
    return errorMessage;
  }
};

export const updUserData = async (fieldName, data) => {
  try {
    await updateProfile(auth.currentUser, { [fieldName]: data });
  } catch (error) {
    console.log(error.message);
  }
};
