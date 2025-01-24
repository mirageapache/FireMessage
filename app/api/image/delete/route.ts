import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function POST(request: Request) {
  try {
    const { type, publicId } = await request.json();
    const deleteResponse = await cloudinary.uploader.destroy(`fireMessage/${type}/${publicId}`);
    if (deleteResponse.result !== 'ok') {
      throw new Error('刪除失敗');
    }

    return NextResponse.json({
      code: "SUCCESS",
      message: "刪除成功",
    });
  } catch (error) {
    return NextResponse.json({
      code: "ERROR",
      message: error instanceof Error ? error.message : '刪除失敗',
    }, { status: 500 });
  }
}
