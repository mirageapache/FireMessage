import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function POST(request: Request) {
  try {
    const { image, type, publicId } = await request.json();

    const uploadResponse = await cloudinary.uploader.upload(image, {
      public_id: publicId,
      overwrite: true,
      folder: `fireMessage/${type}`,
    });

    return NextResponse.json({
      code: "SUCCESS",
      secure_url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });
  } catch (error) {
    return NextResponse.json({
      code: "ERROR",
      message: error instanceof Error ? error.message : '圖片上傳失敗',
    }, { status: 500 });
  }
}
