import { db } from "@/firebase";
import {
  collection, query, where, getDocs, updateDoc,
} from "firebase/firestore";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_ID,
  api_secret: process.env.CLOUDINARY_SECRET,
});

/** 更新使用者資料 */
export const updateUserData = async (
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
export const updateUserImage = async (
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

    // 上傳圖片至 Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64string, {
      public_id: imagePublicId,
      overwrite: true,
      folder: `fireMessage/${type}`,
    });

    await updateUserData(
      uid,
      type,
      { secure_url: uploadResponse.secure_url, public_id: uploadResponse.public_id },
    );

    return { code: "SUCCESS", imageUrl: uploadResponse.secure_url };
  } catch (error) {
    return { code: "ERROR", error };
  }
};
