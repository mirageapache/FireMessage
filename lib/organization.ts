/* eslint-disable import/no-cycle */
/* eslint-disable max-len */

import { db } from "@/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { createChatRoom, updateReadStatus } from "./chat";
import { getRandomColor } from "./utils";
import { createNotification, sendImmediateNotification } from "./notification";
import { userDataType } from "@/types/userType";
import { getSimpleUserData } from "./user";

/** 建立群組 */
export const createOrganization = async (uid: string, organizationName: string, members: string[]) => {
  try {
    const organizationRef = collection(db, "organizations");
    const bgColor = getRandomColor();
    await addDoc(organizationRef, {
      hostId: uid,
      organizationName,
      members: [uid, ...members],
      avatarUrl: "",
      bgColor,
      createdAt: new Date(),
    });
    const roomId = await createChatRoom([uid, ...members], organizationName, "", bgColor, 1);
    await updateReadStatus(roomId, uid);

    const notiPromise = members.map(async (member) => {
      const userData = await getSimpleUserData(uid) as unknown as userDataType;
      await updateReadStatus(roomId, member);
      await createNotification(member, "newOrganization", `${userData.userName}已將您加入「${organizationName}」`, uid);
      await sendImmediateNotification(
        uid,
        member,
        "newOrganization",
        `${userData.userName}已將您加入「${organizationName}」`,
      );
    });

    await Promise.all(notiPromise);

    return { code: "SUCCESS", message: "已新增群組" };
  } catch (error) {
    return { code: "ERROR", message: "建立群組失敗", error };
  }
};

/** 取得群組列表資料 */
export const getOrganizationData = async (uid: string) => {
  try {
    const organizationRef = collection(db, "organizations");
    const organizationQuery = query(organizationRef, where("members", "array-contains", uid ));
    const organizationSnapshot = await getDocs(organizationQuery);
    const organizationList = organizationSnapshot.docs.map((doc) => doc.data());

    return { code: "SUCCESS", data: organizationList };
  } catch (error) {
    return { code: "ERROR", message: "取得群組列表資料失敗", error };
  }
};
