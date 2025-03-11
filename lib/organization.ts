/* eslint-disable import/no-cycle */
/* eslint-disable max-len */

import { db } from "@/firebase";
import {
  collection,
  addDoc,
} from "firebase/firestore";
import { createChatRoom } from "./chat";
import { getRandomColor } from "./utils";

/** 建立群組 */
export const createOrganization = async (uid: string, organizationName: string) => {
  try {
    const organizationRef = collection(db, "organizations");
    await addDoc(organizationRef, {
      hostId: uid,
      members: [uid],
      organizationName,
      avatarUrl: "",
      bgColor: getRandomColor(),
      createdAt: new Date(),
    });

    await createChatRoom([uid], 1);

    return { code: "SUCCESS", message: "建立群組成功" };
  } catch (error) {
    return { code: "ERROR", message: "建立群組失敗", error };
  }
};
