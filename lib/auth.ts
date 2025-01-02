import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  UserCredential,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { store } from "@/store";
import { clearUser, setUser } from "@/store/authSlice";
import { auth, db } from "../firebase";

/** 一般註冊 (Email+Password) */
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
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      username,
      createdAt: new Date(),
      loginType: "email",
    });
    return { code: "SUCCESS", message: "註冊成功" };
  } catch (error) {
    return { code: "ERROR", error };
  }
};

/** 一般登入 (Email+Password) */
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
    return { code: "SUCCESS", data: user };
  } catch (error) {
    return { code: "ERROR", error };
  }
};

/** Oauth 登入 */
export const loginOAuth = async (source: string) => {
  let provider;
  switch (source) {
    case "google":
      provider = new GoogleAuthProvider();
      break;
    case "facebook":
      provider = new FacebookAuthProvider();
      break;
    case "github":
      provider = new GithubAuthProvider();
      break;
    default:
      return null;
  }
  try {
    const result: UserCredential = await signInWithPopup(auth, provider);
    const { user } = result;

    // 將使用者資訊存入 Firestore
    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        email: user.email,
        username: user.displayName,
        createdAt: new Date(),
        loginType: source,
      },
      { merge: true },
    );

    return user;
  } catch (error) {
    return error;
  }
};

/** 登出 */
export const logout = async () => {
  try {
    await signOut(auth);
    store.dispatch(clearUser());
    return { code: "SUCCESS", message: "登出成功" };
  } catch (error) {
    return error;
  }
};
