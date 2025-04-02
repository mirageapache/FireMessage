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
import { chatRoomInfoType } from "@/types/chatType";
import { createChatRoom, sendMessage, updateReadStatus } from "./chat";
import { getRandomColor } from "./utils";
import { createNotification, sendImmediateNotification } from "./notification";
import { getSimpleUserData } from "./user";

/** 更新群組資料 */
export const updateOrganizationData = async (
  orgId: string,
  userData: userDataType,
  data: organizationDataType,
  changeType?: string, // 更新類型(ex. create, editOrgName, editOrgMember)
  userName?: string,
  newMember?: string[], // 新增成員，更動時紀錄於群組訊息內
  removeMember?: string[], // 移除成員，更動時紀錄於群組訊息內
) => {
  const variable = {
    ...data,
    createdAt: Timestamp.fromDate(new Date(data.createdAt)),
  };

  const chatRoomInfo = {
    chatRoomId: data.chatRoomId,
    members: data.members,
    chatRoomName: data.organizationName,
    avatarUrl: data.avatarUrl,
    bgColor: data.bgColor,
    type: 1,
  } as chatRoomInfoType;

  try {
    await updateDoc(doc(db, "organizations", orgId), variable); // 更新群組資料
    await updateDoc(doc(db, "chatRooms", data.chatRoomId), { // 更新對應的聊天室資料
      chatRoomName: data.organizationName,
    });

    switch (changeType) {
      case "editOrgName": // 發送即時通知並紀錄修改群組名稱(ex. test1已修改群組名稱為「測試群組」)
        await sendMessage(
          chatRoomInfo,
          userData,
          `${userName}修改群組名稱為「${data.organizationName}」`,
          "system_message",
        );
        break;
      case "editOrgMember":
        if (newMember && newMember.length > 0) { // 發送即時通知並紀錄新增成員(ex. test1已新增成員"test2")
          await sendMessage(
            chatRoomInfo,
            userData,
            `${userName}已新增成員\n${newMember.map((member) => `"${member}"`).join(",\n")}`,
            "system_message",
          );
        }
        if (removeMember && removeMember.length > 0) { // 發送即時通知並紀錄移除成員(ex. test1已移除成員"test2")
          await sendMessage(
            chatRoomInfo,
            userData,
            `${userName}已移除成員\n${removeMember.map((member) => `"${member}"`).join(", ")}`,
            "system_message",
          );
        }
        // 更新聊天室成員
        await updateDoc(doc(db, "chatRooms", data.chatRoomId), {
          members: data.members,
        });
        break;
      default:
        break;
    }

    return { code: "SUCCESS", message: "更新群組資料成功" };
  } catch (error) {
    return { code: "ERROR", message: "更新群組資料失敗", error };
  }
};

/** 建立群組 */
export const createOrganization = async (userData: userDataType, organizationName: string, members: string[]) => {
  const { uid } = userData;
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
    await updateOrganizationData(
      orgData.id,
      userData,
      { // 更新群組資料(加入聊天室id)
        ...variable,
        orgId: orgData.id,
        chatRoomId: roomId,
      },
      "create",
    );
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
