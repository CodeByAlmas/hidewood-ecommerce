import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { verifyAdminToken } from '@/lib/adminAuth';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    if (!verifyAdminToken(req)) {
      return NextResponse.json({ error: 'Unauthorized Atelier Admin Access' }, { status: 401 });
    }

    const { image } = await req.json();

    if (!image || typeof image !== 'string') {
      return NextResponse.json({ error: 'No valid image provided' }, { status: 400 });
    }

    // Security check: restrict to standard base64 image payload & approx 8MB limit
    if (!image.startsWith('data:image/') || image.length > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Invalid image format or file size exceeds 8MB limit.' }, { status: 400 });
    }

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: 'hidewood-catalog',
      resource_type: 'image',
    });

    return NextResponse.json({ url: uploadResponse.secure_url }, { status: 200 });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Image upload failed' },
      { status: 500 }
    );
  }
}