'use client';

import { AddressFormField, ButtonL, Toast } from '@/components/common';
import { Flex, Box, Text } from '@radix-ui/themes';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { createMeeting, getMeetingForEdit, updateMeeting } from '@/apis/agitsAPI';
import { useRouter } from 'next/navigation';
import { deleteFileFromS3, fetchFileFromS3, getSignedS3Url, uploadFileToS3 } from '@/utils/s3utills';
import { useToast } from '@/hooks';
import { doList, initEmpty, majorCities, NONE } from '@/constants/address';
import { stringToObject } from '@/utils/address';

export default function MeetingForm({ agitId, meetingId, initMeeting, status }) {
  const [existingFile, setExistingFile] = useState('');
  const { toast, setToast, toastMessage, showToast } = useToast();

  const { data: meeting } = useSWR(
    status === 'edit' ? `agits/${agitId}/meetings/${meetingId}/edit` : null,
    async () => {
      if (status === 'edit') {
        const response = await getMeetingForEdit(agitId, meetingId);
        return response;
      }
      return null;
    },
  );
  if (meeting?.errorCode) {
    alert(meeting.message);
  }

  const place = stringToObject(initMeeting.place);

  console.log('place', place);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    defaultValues: {
      ...initMeeting,
      place,
    },
  });

  const router = useRouter();
  const [fileName, setFileName] = useState(meeting?.image);
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setValue('file', file);
    }
  };

  const onSubmit = async (data) => {
    console.log('data', data);
    try {
      const file = data.target.files[0];
      if (!file) return;

      // 기존 이미지 URL 저장
      // let imageUrl = existingFile;

      // 새 파일이 선택된 경우
      // if (data.file && data.file instanceof File) {
      // 파일 형식 검증
      if (!['image/png', 'image/jpeg'].includes(data.type)) {
        alert('지원하지 않는 파일 형식입니다. png 또는 jpg 이미지만 업로드할 수 있습니다.');
        return;
      }

      // 기존 파일 삭제 (필요한 경우)
      // if (existingFile) {
      //   await deleteFileFromS3(existingFile, 'meeting');
      // }
      const { signedUrl, fileName } = await getSignedS3Url(file.type, 'meeting');
      await uploadFileToS3(signedUrl, file);
      // S3 업로드 처리

      // 새로 업로드된 파일 URL 업데이트
      imageUrl = fileName;

      const formData = {
        name: data.name,
        image: imageUrl,
        date: data.date,
        place: data.place,
        content: data.content,
      };
      if (status == 'edit') {
        const update = await updateMeeting(agitId, meetingId, formData);
        if (update?.errorCode) {
          alert(update.message);
        }
        showToast('수정 완료');
        setTimeout(() => {
          router.push(`/service/agits/${agitId}/meetings`);
        }, 2000);
      } else {
        const create = await createMeeting(agitId, formData);
        if (create?.errorCode) {
          alert(create.message);
        }
        showToast('등록 완료');
        setTimeout(() => {
          router.push(`/service/agits/${agitId}/meetings`);
        }, 2000);
      }
    } catch (error) {
      alert('업데이트에 실패했습니다. 다시 시도해주세요.');
    }
  };

  console.log(meeting?.place);

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="column" gap="20px">
          <Flex direction="column" gap="10px">
            <Box className="row">
              <Text as="label" className="require">
                모임 이름
              </Text>
              <Box className="input">
                <input
                  id="name"
                  type="text"
                  placeholder="모임 이름을 입력해주세요"
                  {...register('name', {
                    required: '모임 이름을 입력해주세요.',
                    maxLength: {
                      value: 20,
                      message: '최대 20자까지만 입력할 수 있습니다.',
                    },
                  })}
                  className={errors.name ? 'error' : ''}
                />
              </Box>
              {errors.name && (
                <Text as="p" className="error">
                  {errors.name.message}
                </Text>
              )}
            </Box>
            <Box className="row">
              <Text as="label" className="require">
                모임 이미지
              </Text>
              <Box className="input input_btn input_file">
                <input type="file" id="file" accept=".jpg,.jpeg,.png,.pdf" onChange={onFileChange} />
                <input
                  id="image"
                  type="text"
                  value={fileName}
                  {...register('image')}
                  placeholder="이미지를 추가해주세요"
                  className={errors.image ? 'error' : ''}
                  readOnly
                />

                <label htmlFor="file">파일 선택</label>
              </Box>
              {errors.image && (
                <Text as="p" className="error">
                  {errors.image.message}
                </Text>
              )}
            </Box>
            <Box className="row">
              <Text as="label" className="require">
                모임 일시
              </Text>
              <Box className="input">
                <input
                  id="date"
                  type="datetime-local"
                  placeholder="YYYY / MM / DD T HH : MM : SS"
                  {...register('date', {
                    required: '모임 일시를 설정해주세요',
                    maxLength: {
                      value: 20,
                      message: '연,월,일,시,분,초 순으로 작성해주세요.',
                    },
                  })}
                  className={errors.date ? 'error' : ''}
                />
              </Box>
              {errors.date && (
                <Text as="p" className="error">
                  {errors.date.message}
                </Text>
              )}
            </Box>
            <Box className="row">
              <Controller
                name="place"
                control={control}
                render={({ field }) => (
                  <AddressFormField
                    value={field.value}
                    onChange={(newAddress) => {
                      field.onChange(newAddress);
                    }}
                    showToast={showToast}
                  />
                )}
              />
            </Box>
            <Box className="row">
              <Text as="label" className="require">
                안내사항
              </Text>
              <Box className="textarea">
                <textarea
                  id="content"
                  placeholder="해당 모임의 안내사항을 적어주세요"
                  {...register('content', {
                    required: '해당 모임의 안내사항을 적어주세요',
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
          <ButtonL style="deep" type="submit">
            {status == 'create' ? '등록하기' : '수정하기'}
          </ButtonL>
        </Flex>
      </form>
    </>
  );
}
