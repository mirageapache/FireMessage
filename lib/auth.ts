import {
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from 'firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from 'firebase';

/**
 * 一般註冊 (Email+密碼)
 * @param email
 * @param password
 * @param username
 */
const registerWithEmailAndPassword = async (email: string, password: string, username: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    await setDoc(doc(db, 'users', username.uid), {
      uid: user.uid,
      email: user.email,
      username,
      createdAt: new Date(),
    });

  } catch (error) {
    
  }
};
