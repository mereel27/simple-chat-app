import styles from '../styles/loginForm.module.css';
/* import { auth, signInWithEmail, logout, createUser } from '../lib/firebaseAuth'; */
import { addUser } from '../lib/firebaseFirestore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button } from '@mui/material';
import { LoginOutlined } from '@mui/icons-material';
import { useAuth } from '../lib/auth';

export default function LoginForm(props) {
  const auth = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    if (auth.user) {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const button = e.nativeEvent.submitter.name;
    const mail = e.target.mail.value;
    const password = e.target.pswd.value;
    if (button === 'signin') {
      const signIn = await auth.signInWithEmail(mail, password);
      signIn && setError(signIn);
    }
    if (button === 'signup') {
      const signUp = await auth.createUser(mail, password);
      signUp && setError(signUp);
    }
  };

  /* const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === 'mail') {
      setMail(value);
    }
    if (name === 'pswd') {
      setPswd(value);
    }
  }; */

  const handleSignOut = (e) => {
    e.preventDefault();
    auth.logout();
  };

  return props.user ? (
    <div className={styles.container}>
      <form onSubmit={handleSignOut}>
        <input className={styles.submit} type="submit" value="Sign out"></input>
      </form>
    </div>
  ) : (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <TextField
          name="mail"
          type="e-mail"
          className={styles.inputs}
          label="e-mail"
          variant="outlined"
          required
          margin="normal"
          error={error === 'Firebase: Error (auth/email-already-in-use).'}
          helperText={error === 'Firebase: Error (auth/email-already-in-use).' && 'User already exist'}
        />
        <TextField
          name="pswd"
          type="password"
          className={styles.inputs}
          label="password"
          variant="outlined"
          required
          margin="normal"
          error={error === 'Firebase: Error (auth/wrong-password).'}
          helperText={error === 'Firebase: Error (auth/wrong-password).' && 'Wrong password'}
        />
        <div className={styles.buttons}>
          <Button variant="outlined" type="submit" name="signup">Sign Up</Button>
          <Button variant="outlined" type="submit" name="signin" endIcon={<LoginOutlined />}>Login</Button>
        </div>
      </form>
    </div>
  );
}
