import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
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
import { clearUser, setUser } from "@/store/userSlice";
import { userDataType } from "@/types/userType";
import { getRandomColor } from "./utils";
import { auth, db } from "../firebase";

const cookies = new Cookies();

/** 建立使用者 */
const createUser = async (
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
      avatarUrl: "",
      bgColor: getRandomColor(), // 頭貼背景色
      biography: "",
      coverUrl: "",
      createdAt: new Date(),
      loginType: source,
      userType: "0", // 0: 一般使用者, 1: 管理員
    });
    await setDoc(doc(db, "userSettings", user.uid), {
      uid: user.uid,
      darkMode: "dark",
      toastifyPosition: "top-center",
      template: "default",
      language: "zh-TW",
    });

    return 'success';
  } catch (error) {
    return error;
  }
};

/** 發送email驗證信 */
export const sendVerification = async () => {
  const authentication = getAuth();
  const user = authentication.currentUser as User;
  const res = await sendEmailVerification(user)
    .then(() => ({ code: "SUCCESS", message: "驗證信已發送" }))
    .catch((error) => ({ code: "ERROR", error }));
  return res;
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
    await createUser(user, username, "email");
    await sendEmailVerification(user);
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
      await createUser(user, user.displayName, source);
    }

    // 獲取用戶文檔數據
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data() as userDataType;
      store.dispatch(setUser(userData)); // 存儲序列化後的用戶數據
    }

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
    localStorage.clear();
    store.dispatch(clearUser());
    window.indexedDB.deleteDatabase('firebaseLocalStorage');
    cookies.remove("UAT");
    return { code: "SUCCESS", message: "登出成功" };
  } catch (error) {
    return error;
  }
};
