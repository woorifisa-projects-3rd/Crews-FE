'use client';
import { Box, Flex, Text } from '@radix-ui/themes';
import { ButtonL, Toast } from '../../common';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks';
import { useEffect, useState } from 'react';
import { getFeedForEdit, updateFeed } from '@/apis/agitsAPI';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { deleteFileFromS3, getSignedS3Url, uploadFileToS3 } from '@/utils/s3utills';

export default function FeedEditForm({ agitId, feedId }) {
  const [existingFile, setExistingFile] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { toast, setToast, toastMessage, showToast } = useToast();
  const { data: feed } = useSWR(`agits/${agitId}/feeds/${feedId}/edit`, async () => {
    const response = await getFeedForEdit(agitId, feedId);
    return response;
  });
  if (feed?.errorCode) {
    throw new Error(feed.message);
  }
  const router = useRouter();
  const onSubmit = async (data) => {
    try {
      // 기존 이미지 URL 저장
      let imageUrl = existingFile;

      // 새 파일이 선택된 경우
      if (data.file) {
        // 파일 형식 검증
        if (!['image/png', 'image/jpeg'].includes(data.file.type)) {
          alert('지원하지 않는 파일 형식입니다. png 또는 jpg 이미지만 업로드할 수 있습니다.');
          return;
        }

        // 기존 파일 삭제 (필요한 경우)
        if (existingFile) {
          await deleteFileFromS3(existingFile, 'feed');
        }

        // S3 업로드 처리
        const { signedUrl, fileName } = await getSignedS3Url(data.file.type, 'feed');
        await uploadFileToS3(signedUrl, data.file);

        // 새로 업로드된 파일 URL 업데이트
        imageUrl = fileName;
      }
      const formData = {
        image: imageUrl,
        content: data.content,
      };
      await updateFeed(agitId, feedId, formData);
      showToast('수정되었습니다!');
      setTimeout(() => {
        router.push(`/service/agits/${agitId}/feeds/${feedId}`);
      }, 1500);
    } catch (error) {
      console.error('업데이트 중 오류 발생:', error);
      alert('업데이트에 실패했습니다. 다시 시도해주세요.');
    }
  };
  const [fileName, setFileName] = useState('');
  useEffect(() => {
    if (feed?.image) {
      setFileName(feed.image);
    }
  }, [feed]);
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setValue('file', file);
    }
  };
  useEffect(() => {
    if (feed) {
      setValue('content', feed.content);
    }
  }, [feed, setValue]);
  return (
    <>
      <Toast
        as="info"
        isActive={toast}
        onClose={() => {
          setToast(false);
        }}
      >
        {toastMessage}
      </Toast>
      <Box className="content">
        <section>
          <Flex direction="column" gap="20px">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex direction="column" gap="10px">
                <Box className="row">
                  <Text as="label">활동 이미지</Text>
                  <Box className="input input_btn input_file">
                    <input
                      type="file"
                      id="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      {...register('file')}
                      onChange={onFileChange}
                    />
                    <input
                      id="image"
                      type="text"
                      value={fileName}
                      placeholder="이미지를 추가해주세요"
                      className={errors.file ? 'error' : ''}
                      readOnly
                    />

                    <label htmlFor="file">파일 선택</label>
                  </Box>
                  {errors.file && (
                    <Text as="p" className="error">
                      {errors.file.message}
                    </Text>
                  )}
                </Box>
                <Box className="row">
                  <Text as="label" className="require">
                    활동 내용
                  </Text>
                  <Box className="textarea">
                    <textarea
                      id="content"
                      placeholder="기록하고 싶은 활동 내용을 적어주세요"
                      {...register('content', {
                        required: '한줄 소개를 입력해주세요.',
                      })}
                      className={errors.content ? 'error' : ''}
                    />
                  </Box>
                  {errors.content && (
                    <Text as="p" className="error">
                      {errors.content.message}
                    </Text>
                  )}
                </Box>
              </Flex>
            </form>
            <ButtonL style="deep" onClick={handleSubmit(onSubmit)}>
              수정하기
            </ButtonL>
          </Flex>
        </section>
      </Box>
    </>
  );
}
