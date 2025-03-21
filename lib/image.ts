import { db } from "@/firebase";
import {
  collection, query, where, getDocs, updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";

/** 處理上傳圖片 */
const handleUploadImage = async (
  type: string,
  imagePublicId: string,
  file: File,
) => {
  try {
    // 將 File 物件轉換成 base64
    const base64string = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.readAsDataURL(file);
    });

    // 透過 API 上傳圖片至 Cloudinary
    const response = await fetch('/api/image/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64string,
        type,
        publicId: imagePublicId,
      }),
    });

    return response.json();
  } catch (error) {
    return { code: "ERROR", error };
  }
};

/** 處理刪除圖片 */
const handleDeleteImage = async (
  type: string,
  imagePublicId: string,
) => {
  try {
    // 透過 API 從 Cloudinary 刪除圖片
    const response = await fetch('/api/image/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        publicId: imagePublicId,
      }),
    });

    return response.json();
  } catch (error) {
    return { code: "ERROR", error };
  }
};

/** 更新使用者封面/頭貼 */
const updateUserImage = async (
  uid: string,
  type: string,
  data: { secure_url: string, public_id: string },
) => {
  const userRef = collection(db, "users");
  const userQuery = query(userRef, where("uid", "==", uid));
  const userSnapshot = await getDocs(userQuery);
  const userDoc = userSnapshot.docs[0];

  const updateData = type === 'cover'
    ? {
      coverUrl: data.secure_url,
      coverPublicId: data.public_id,
    }
    : {
      avatarUrl: data.secure_url,
      avatarPublicId: data.public_id,
    };

  await updateDoc(userDoc.ref, updateData);
};

/** 上傳使用者頭貼/封面 */
export const uploadUserImage = async (
  uid: string,
  type: string,
  imagePublicId: string,
  file: File,
) => {
  try {
    const data = await handleUploadImage(type, imagePublicId, file);
    if (data.code === "ERROR") {
      throw new Error(data.message || '圖片上傳失敗');
    }
    await updateUserImage(
      uid,
      type,
      { secure_url: data.secure_url, public_id: data.public_id.split("/")[2] },
    );

    return { code: "SUCCESS", imageUrl: data.secure_url, public_id: data.public_id.split("/")[2] };
  } catch (error) {
    return {
      code: "ERROR",
      error: error instanceof Error ? error.message : '更新圖片失敗',
    };
  }
};

/** 刪除使用者頭貼/封面 */
export const deleteUserImage = async (
  uid: string,
  type: string,
  imagePublicId: string,
) => {
  try {
    const data = await handleDeleteImage(type, imagePublicId);
    if (data.code === "ERROR") {
      throw new Error(data.message || '圖片刪除失敗');
    }

    await updateUserImage(
      uid,
      type,
      { secure_url: '', public_id: '' },
    );

    return { code: "SUCCESS" };
  } catch (error) {
    return {
      code: "ERROR",
      error: error instanceof Error ? error.message : '圖片刪除失敗',
    };
  }
};

/** 更新群組封面/頭貼 */
const updateOrgImage = async (
  orgId: string,
  uid: string,
  type: string,
  data: { secure_url: string, public_id: string },
) => {
  const orgDoc = doc(db, "organizations", orgId);
  const orgSnapshot = await getDoc(orgDoc);

  if (!orgSnapshot.exists()) {
    throw new Error('找不到群組');
  }

  // 檢查用戶是否為群組成員
  const orgData = orgSnapshot.data();
  if (!orgData.members.includes(uid)) {
    throw new Error('沒有權限更新群組圖片');
  }

  const updateData = type === 'avatar'
    ? {
      avatarUrl: data.secure_url,
      avatarPublicId: data.public_id,
    }
    : {
      coverUrl: data.secure_url,
      coverPublicId: data.public_id,
    };

  await updateDoc(orgDoc, updateData);
};

/** 上傳群組頭貼/封面 */
export const uploadOrgImage = async (
  orgId: string,
  uid: string,
  type: string,
  imagePublicId: string,
  file: File,
) => {
  try {
    const data = await handleUploadImage(type, imagePublicId, file);
    if (data.code === "ERROR") {
      throw new Error(data.message || '圖片上傳失敗');
    }

    await updateOrgImage(
      orgId,
      uid,
      type,
      { secure_url: data.secure_url, public_id: data.public_id.split("/")[2] },
    );

    return { code: "SUCCESS", imageUrl: data.secure_url, public_id: data.public_id.split("/")[2] };
  } catch (error) {
    return {
      code: "ERROR",
      error: error instanceof Error ? error.message : '更新圖片失敗',
    };
  }
};

/** 刪除群組圖片 */
export const deleteOrgImage = async (
  orgId: string,
  uid: string,
  type: string,
  imagePublicId: string,
) => {
  try {
    const data = await handleDeleteImage(type, imagePublicId);
    if (data.code === "ERROR") {
      throw new Error(data.message || '圖片刪除失敗');
    }

    await updateOrgImage(
      orgId,
      uid,
      type,
      { secure_url: '', public_id: '' },
    );

    return { code: "SUCCESS" };
  } catch (error) {
    return {
      code: "ERROR",
      error: error instanceof Error ? error.message : '圖片刪除失敗',
    };
  }
};
