import { db } from "@/firebase";
import {
  collection, query, where, getDocs, updateDoc,
} from "firebase/firestore";

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

  const updateData = type === 'avatar'
    ? {
      avatarUrl: data.secure_url,
      avatarPublicId: data.public_id,
    }
    : {
      coverUrl: data.secure_url,
      coverPublicId: data.public_id,
    };

  await updateDoc(userDoc.ref, updateData);
};

/** 上傳頭貼/封面 */
export const uploadImage = async (
  uid: string,
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

    const data = await response.json();
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

/** 刪除圖片 */
export const deleteUserImage = async (
  uid: string,
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

    const data = await response.json();
    if (data.code === "ERROR") {
      throw new Error(data.message || '圖片刪除失敗');
    }

    // 更新使用者資料，清空相關欄位
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
