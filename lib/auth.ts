import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { store } from '@/store';
import { setUser } from '@/store/authSlice';
import { auth, db } from '../firebase';

/**
 * 一般註冊 (Email+Password)
 */
export const registerWithEmailAndPassword = async (
  email: string,
  password: string,
  username: string,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const { user } = userCredential;
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      username,
      createdAt: new Date(),
    });
    store.dispatch(setUser(user));
    return user;
  } catch (error) {
    console.log(error);
    return error;
  }
};

/**
 * 一般登入 (Email+Password)
 */
export const loginWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const { user } = userCredential;
    store.dispatch(setUser(user));
    return user;
  } catch (error) {
    console.error('Login Error:', error);
    return error;
  }
};

/** 登出 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
  }
};
