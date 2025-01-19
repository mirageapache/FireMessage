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
import { get } from "lodash";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Cookies from "universal-cookie";
import { store } from "@/store";
import { clearUser, setUser } from "@/store/authSlice";
import { userDataType } from "@/types/userType";
import { getRandomColor } from "./utils";
import { auth, db } from "../firebase";

const cookies = new Cookies();

/** write new User to firestore */
const writeUser = async (
  user: User,
  username: string | null,
  source: string,
) => {
  try {
    const userName = username === null ? user.email?.slice(0, user.email.indexOf("@")) : username;
    // 檢查 userName 是否已存在
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("userName", "==", userName));
    const querySnapshot = await getDocs(q);

    let userAccount = userName;
    if (!querySnapshot.empty) {
      // 如果用戶名已存在，再加入3位數亂數
      const randomNum = Math.floor(Math.random() * 900) + 100; // 生成100-999之間的隨機數
      userAccount = `${userName}_${randomNum}`;
    }

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      userName,
      userAccount,
      createdAt: new Date(),
      loginType: source,
      userType: "0", // 0: 一般使用者, 1: 管理員
    });
    await setDoc(doc(db, "userSettings", user.uid), {
      uid: user.uid,
      avatarUrl: "",
      bgColor: getRandomColor(),
      darkMode: "dark",
      toastifyPosition: "bottom-right",
      template: "default",
    });

    return 'success';
  } catch (error) {
    return error;
  }
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

    const userData: userDataType = {
      id: user.uid,
      uid: user.uid,
      email: user.email,
      displayName: get(user, "providerData[0].displayName", ""),
      photoURL: get(user, "providerData[0].photoURL", ""),
      loginType: "email",
      createdAt: user.metadata.creationTime,
      emailVerified: user.emailVerified,
    };

    store.dispatch(setUser(userData));
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
    cookies.remove("UAT");
    return { code: "SUCCESS", message: "登出成功" };
  } catch (error) {
    return error;
  }
};
