import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

import { addUser } from './firebaseFirestore';

const firebaseAuth = getAuth();
const authContext = createContext();

export const useAuth = () => {
  return useContext(authContext);
};

export function AuthProvider({ children }) {
  const auth = useFirebaseAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

function useFirebaseAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleUser = async (rawUser) => {
    if (rawUser) {
      const user = await formatUser(rawUser);
      const { token, ...userWithoutToken } = user;

      /* createUser(user.uid, userWithoutToken); */
      setUser(user);

      setLoading(false);
      return user;
    } else {
      setUser(false);
      setLoading(false);
      return false;
    }
  };

  const signInWithEmail = async (email, password, redirect) => {
    setLoading(true);
    /* auth.useDeviceLanguage(); */
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password).then(
        (response) => {
          handleUser(response.user);
          if (redirect) {
            router.push(redirect);
          }
        }
      );
    } catch (error) {
      console.log(error);
      return error.message;
    }
  };

  const logout = (e) => {
    e.preventDefault();
    signOut(firebaseAuth)
      .then((response) => {
        // Sign-out successful.
        handleUser(false);
        console.log(response);
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const createUser = async (email, password, redirect) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then(async response => {
        const { email, phoneNumber, metadata: { createdAt }, uid, displayName, photoURL } = response.user;
        const data = {email, phoneNumber, createdAt, uid, displayName, photoURL, channel: '' };
        await addUser(uid, data).then(() => { 
          handleUser(response.user)
          if (redirect) {
            router.push(redirect);
          }
        });
      }
    );
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      // ..
      return errorMessage;
    }
  };

  const updUserData = async (fieldName, data) => {
    try {
      await updateProfile(firebaseAuth.currentUser, { [fieldName]: data });
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = firebaseAuth.onIdTokenChanged(handleUser);
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* TBA: some log in and log out function that will also call handleUser */

  return {
    user,
    loading,
    createUser,
    signInWithEmail,
    logout,
  };
}

const formatUser = async (user) => {
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    photoUrl: user.photoURL,
    provider: user.providerData[0].providerId,
    token: user.accessToken,
  };
};
