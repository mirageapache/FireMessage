import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Cookies from 'universal-cookie';
import { store } from "@/store";
import { clearUser, setUser } from "@/store/authSlice";
import { auth, db } from "../firebase";
import { getRandomColor } from "./utils";

const cookies = new Cookies();

/** 寫入User資料 to firestore */
const writeUser = async (user: User, username: string | null, source: string) => {
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    username: username === null ? user.email?.slice(0, user.email.indexOf("@")) : username,
    createdAt: new Date(),
    loginType: source,
  });
  await setDoc(doc(db, "userSettings", user.uid), {
    uid: user.uid,
    bgColor: getRandomColor(),
    darkMode: "dark",
    toastifyPosition: "bottom-right",
    template: "default",
  });
};

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
    await writeUser(user, username, "email");
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
    const token = await user.getIdToken();
    cookies.set("UAT", token);
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

    const isNewUser = await getDoc(doc(db, "users", user.uid));
    if (!isNewUser.exists()) {
      await writeUser(user, user.displayName, source);
    }

    store.dispatch(setUser(user));
    const token = await user.getIdToken();
    cookies.set("UAT", token);
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
