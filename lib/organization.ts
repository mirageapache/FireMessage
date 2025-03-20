/* eslint-disable import/no-cycle */
/* eslint-disable max-len */

import { db } from "@/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { userDataType } from "@/types/userType";
import { organizationDataType } from "@/types/organizationType";
import { createChatRoom, updateReadStatus } from "./chat";
import { getRandomColor } from "./utils";
import { createNotification, sendImmediateNotification } from "./notification";
import { getSimpleUserData } from "./user";

/** 更新群組資料 */
export const updateOrganizationData = async (orgId: string, data: organizationDataType) => {
  const variable = {
    ...data,
    createdAt: Timestamp.fromDate(new Date(data.createdAt)),
  };

  try {
    await updateDoc(doc(db, "organizations", orgId), variable);

    return { code: "SUCCESS", message: "更新群組資料成功" };
  } catch (error) {
    return { code: "ERROR", message: "更新群組資料失敗", error };
  }
};

/** 建立群組 */
export const createOrganization = async (uid: string, organizationName: string, members: string[]) => {
  try {
    const bgColor = getRandomColor();
    const variable = {
      hostId: uid,
      organizationName,
      members: [uid, ...members],
      coverUrl: "",
      coverPublicId: "",
      avatarUrl: "",
      avatarPublicId: "",
      description: "",
      bgColor,
      createdAt: new Date(),
    };
    const organizationRef = collection(db, "organizations");
    const orgData = await addDoc(organizationRef, variable);
    const roomId = await createChatRoom([uid, ...members], organizationName, "", bgColor, 1); // 建立聊天室
    await updateOrganizationData(orgData.id, { // 更新群組資料(加入聊天室id)
      ...variable,
      orgId: orgData.id,
      chatRoomId: roomId,
    });
    await updateReadStatus(roomId, uid); // 當前使用者更新聊天室未讀狀態

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
    const organizationQuery = query(organizationRef, where("members", "array-contains", uid));
    const organizationSnapshot = await getDocs(organizationQuery);
    const organizationList = organizationSnapshot.docs.map((orgDoc) => {
      const data = orgDoc.data();
      return {
        orgId: orgDoc.id,
        members: data.members,
        organizationName: data.organizationName,
        avatarUrl: data.avatarUrl,
        bgColor: data.bgColor,
        chatRoomId: data.chatRoomId,
      };
    });

    return { code: "SUCCESS", data: organizationList };
  } catch (error) {
    return { code: "ERROR", message: "取得群組列表資料失敗", error };
  }
};

/** 取得群組詳細資料 */
export const getOrganizationDetail = async (orgId: string) => {
  try {
    const organizationRef = doc(db, "organizations", orgId);
    const organizationSnapshot = await getDoc(organizationRef);

    const organizationData = {
      ...organizationSnapshot.data(),
      orgId: organizationSnapshot.id,
      createdAt: organizationSnapshot.data()?.createdAt?.toDate()?.toISOString(),
    };

    return { code: "SUCCESS", data: organizationData };
  } catch (error) {
    return { code: "ERROR", message: "取得群組列表資料失敗", error };
  }
};

/** 取得群組成員資料 */
export const getOrganizationMemberData = async (orgId: string, uid: string, members: string[]) => {
  try {
    const memberListPromise = members.map(async (member) => {
      const friendData = await getSimpleUserData(member) as unknown as userDataType;
      return {
        uid: member,
        userName: friendData.userName,
        avatarUrl: friendData.avatarUrl,
        bgColor: friendData.bgColor,
        isSelected: true,
      };
    });

    const memberList = await Promise.all(memberListPromise);

    return { code: "SUCCESS", data: memberList };
  } catch (error) {
    return { code: "ERROR", message: "取得資料失敗", error };
  }
};
