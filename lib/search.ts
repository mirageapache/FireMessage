import { db } from "@/firebase";
import {
  collection, getDocs, query, where,
} from "firebase/firestore";

/** 搜尋用戶 */
export const searchUser = async (keyword: string, uid: string) => {
  try {
    const usersRef = collection(db, "users");
    const userNameQuery = query(
      usersRef,
      where("userName", ">=", keyword),
      where("userName", "<=", `${keyword}\uf8ff`),
    );

    const userAccountQuery = query(
      usersRef,
      where("userAccount", ">=", keyword),
      where("userAccount", "<=", `${keyword}\uf8ff`),
    );

    const [userNameSnapshot, userAccountSnapshot] = await Promise.all([
      getDocs(userNameQuery),
      getDocs(userAccountQuery),
    ]);

    if (userNameSnapshot.empty && userAccountSnapshot.empty) {
      return { code: "NOT_FOUND", count: 0 };
    }

    // 合併結果並去重複及排除自己
    const results = [...userNameSnapshot.docs, ...userAccountSnapshot.docs]
      .map((doc) => {
        const data = doc.data();
        return {
          uid: data.uid,
          userName: data.userName,
          userAccount: data.userAccount,
          avatarUrl: data.avatarUrl,
          bgColor: data.bgColor,
        };
      })
      .filter(
        (value, index, self) => index === self.findIndex(
          (t) => t.userAccount === value.userAccount,
        ),
      )
      .filter((item) => item.uid !== uid);

    return { code: "SUCCESS", count: results.length, data: results };
  } catch (error) {
    return { code: "ERROR", error };
  }
};
