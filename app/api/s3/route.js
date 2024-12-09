'use server';
import { auth } from '@/auth';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { jwtDecode } from 'jwt-decode';
import { NextResponse } from 'next/server';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const POST = async (request) => {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      throw new Error('유효한 인증 토큰이 없습니다.');
    }

    const decoded = jwtDecode(session.accessToken);
    const memberId = decoded.memberId;

    if (!memberId) {
      console.error('잘못된 memberId:', memberId);
      return NextResponse.json({ error: '올바른 User ID가 필요합니다.' }, { status: 400 });
    }

    const { fileType, folder } = await request.json();
    if (!fileType || typeof fileType !== 'string') {
      console.error('잘못된 fileType:', fileType);
      return NextResponse.json({ error: '올바른 파일 타입이 필요합니다.' }, { status: 400 });
    }

    if (!['image/png', 'image/jpeg'].includes(fileType)) {
      console.error('지원하지 않는 파일 타입:', fileType);
      return NextResponse.json({ error: '지원하지 않는 파일 타입입니다. png 또는 jpg만 가능합니다.' }, { status: 400 });
    }

    if (!['temps', 'profiles', 'feed'].includes(folder)) {
      console.error('잘못된 폴더 이름:', folder);
      return NextResponse.json({ error: '올바른 폴더 이름이 필요합니다. (temps, profiles, feed)' }, { status: 400 });
    }

    const extension = fileType === 'image/png' ? 'png' : 'jpg';
    const timestamp = Date.now();
    const fileName = `${folder}/${memberId}/${memberId}_profile_${timestamp}.${extension}`;

    const listParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Prefix: `${folder}/${memberId}/`,
    };
    const listedObjects = await s3.send(new ListObjectsV2Command(listParams));

    if (listedObjects.Contents && listedObjects.Contents.length > 0) {
      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Delete: { Objects: listedObjects.Contents.map(({ Key }) => ({ Key })) },
      };
      await s3.send(new DeleteObjectsCommand(deleteParams));
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      ContentType: fileType,
      CacheControl: 'no-cache, no-store, must-revalidate',
    };

    const command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    console.log('Generated signed URL:', signedUrl);
    return NextResponse.json({ signedUrl, fileName });
  } catch (error) {
    console.error('S3 업로드 URL 생성 오류:', error);
    return NextResponse.json({ error: 'S3 업로드 URL 생성 중 오류가 발생했습니다.' }, { status: 500 });
  }
};

export const DELETE = async (request) => {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      throw new Error('유효한 인증 토큰이 없습니다.');
    }

    const { fileName } = await request.json();
    if (!fileName) {
      return NextResponse.json({ error: '파일 이름이 필요합니다.' }, { status: 400 });
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    return NextResponse.json({ message: '파일이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('S3 파일 삭제 오류:', error);
    return NextResponse.json({ error: 'S3 파일 삭제 중 오류가 발생했습니다.' }, { status: 500 });
  }
};
