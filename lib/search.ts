import { db } from "@/firebase";
import { friendStatusDataType } from "@/types/friendType";
import {
  collection, getDocs, query, where,
} from "firebase/firestore";
import { get } from "lodash";

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

    const friendRef = collection(db, "friends");
    const friendQuery = query(friendRef, where("uid", "==", uid));
    const friendSnapshot = await getDocs(friendQuery);
    let friendList = [];
    if (!friendSnapshot.empty) friendList = get(friendSnapshot.docs[0].data(), "friendList", []);

    // 合併結果並去重複及排除自己
    const results = [...userNameSnapshot.docs, ...userAccountSnapshot.docs]
      .map((doc) => {
        const data = doc.data();
        let friendStatus = 0;
        if (friendList) {
          friendStatus = friendList.find((item: friendStatusDataType) => {
            if (item.uid === data.uid) return item.status;
            return 0;
          });
        }

        return {
          uid: data.uid,
          userName: data.userName,
          userAccount: data.userAccount,
          avatarUrl: data.avatarUrl,
          bgColor: data.bgColor,
          friendStatus,
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

/** 搜尋群組  */
export const searchOrganization = async (keyword: string) => {
  try {
    const organizationsRef = collection(db, "organizations");
    const organizationNameQuery = query(
      organizationsRef,
      where("organizationName", ">=", keyword),
      where("organizationName", "<=", `${keyword}\uf8ff`),
    );

    const [organizationNameSnapshot] = await Promise.all([
      getDocs(organizationNameQuery),
    ]);

    if (organizationNameSnapshot.empty) {
      return { code: "NOT_FOUND", count: 0 };
    }

    const results = organizationNameSnapshot.docs.map((doc) => doc.data());

    return { code: "SUCCESS", count: results.length, data: results };
  } catch (error) {
    return { code: "ERROR", error };
  }
};
