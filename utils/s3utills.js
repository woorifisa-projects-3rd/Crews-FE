export const getSignedS3Url = async (fileType, folder) => {
  const response = await fetch('/api/s3', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileType, folder }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log(`S3 URL 생성 중 오류 발생: ${errorText}`);
  }

  return response.json();
};

export const uploadFileToS3 = async (signedUrl, file) => {
  const uploadResponse = await fetch(signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!uploadResponse.ok) {
    console.log('S3 파일 업로드 중 오류 발생');
  }
};

export const deleteFileFromS3 = async (fileName, folder) => {
  const response = await fetch('/api/s3', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName, folder }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log(`S3 파일 삭제 중 오류 발생: ${errorText}`);
  }
};
