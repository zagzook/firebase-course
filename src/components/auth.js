import { useState } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, signOut, signInWithEmailAndPassword } from 'firebase/auth';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //console.log(auth?.currentUser?.photoURL);

  const signIn = async () => {
    console.log(email, password);
    if (email === null || password === null) {
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      await createUserWithEmailAndPassword(auth, email, password);
      console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className='row row-cols-lg-auto g-2 align-items-center mt-5'>
        <div className='col-12'>
          <div className='input-group'>
            <input type='email' className='form-control' placeholder='Email...' onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className='col-12'>
          <div className='input-group'>
            <input type='password' className='form-control' placeholder='Password...' onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        <div className='col-12'>
          <div className='input-group'>
            <button className='btn btn-primary m-3' onClick={signIn}>
              Sign In
            </button>
          </div>
        </div>
        <div className='col-12'>
          <div className='input-group'>
            <button className='btn btn-danger m-3' onClick={signInWithGoogle}>
              Sign In With Google
            </button>
          </div>
        </div>

        <div className='col-12'>
          <div className='input-group'>
            <button className='btn btn-success m-3' onClick={logOut}>
              Logout
            </button>
          </div>
        </div>
        <div>
          <span>User Logged in: {auth?.currentUser?.uid !== undefined ? auth.currentUser.uid : 'No one logged in'}</span>
        </div>
      </div>

      {/* <input placeholder='Email...' type='email' onChange={(e) => setEmail(e.target.value)} /> */}
      {/* <input placeholder='Password...' type='password' onChange={(e) => setPassword(e.target.value)} /> */}
      {/* <button className='btn btn-primary m-3' onClick={signIn}>
        Sign In
      </button> */}
      {/* <button className='btn btn-danger m-3' onClick={signInWithGoogle}>
        Sign In With Google
      </button>
      <button className='btn btn-success m-3' onClick={logOut}>
        Logout
      </button> */}
    </div>
  );
};
