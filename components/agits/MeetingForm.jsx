'use client';

import { AddressFormField, ButtonL } from '@/components/common';
import { Flex, Box, Text } from '@radix-ui/themes';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { createMeeting, getMeetingForEdit, updateMeeting } from '@/apis/agitsAPI';
import { useRouter } from 'next/navigation';
import { deleteFileFromS3, getSignedS3Url, uploadFileToS3 } from '@/utils/s3utills';

export default function MeetingForm({ agitId, meetingId, status }) {
  const [existingFile, setExistingFile] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm();
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
    throw new Error(meeting.message);
  }
  const router = useRouter();
  const [fileName, setFileName] = useState(meeting?.image || '');
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setValue('file', file);
    }
  };
  useEffect(() => {
    if (meeting) {
      setValue('name', meeting.name);
      setValue('date', meeting.date);
      setValue('place', meeting.place);
      setValue('content', meeting.content);
      if (meeting.image) {
        setFileName(meeting.image); // 수정 상태에서 기존 파일명 설정
      }
      console.log('before data: ', meeting.date);
    }
  }, [meeting, setValue]);

  const onSubmit = async (data) => {
    console.log('submit data: ', data);
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
          await deleteFileFromS3(existingFile, 'meeting');
        }

        // S3 업로드 처리
        const { signedUrl, fileName } = await getSignedS3Url(data.file.type, 'meeting');
        await uploadFileToS3(signedUrl, data.file);

        // 새로 업로드된 파일 URL 업데이트
        imageUrl = fileName;
      }

      const formData = {
        name: data.name,
        image: imageUrl,
        date: data.date,
        place: data.place,
        content: data.content,
      };
      console.log('formed data:', formData);
      if (status == 'edit') {
        await updateMeeting(agitId, meetingId, formData);
        router.push(`/service/agits/${agitId}/meetings`);
        console.log('수정 완료');
      } else {
        await createMeeting(agitId, formData);
        router.push(`/service/agits/${agitId}/meetings`);
        console.log('등록 완료');
      }
    } catch (error) {
      console.error('업데이트 중 오류 발생:', error);
      alert('업데이트에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
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
            <Text as="label">모임 이미지</Text>
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
          {/* <Box className="row">
            <Text as="label" className="require">
              모임 위치
            </Text>
            <Box className="input input_btn">
              <input
                id="place"
                type="text"
                value="서울 관악구 신림동"
                placeholder="모임 위치를 입력해주세요"
                {...register('place', {
                  required: '모임 위치를 입력해주세요',
                })}
                className={errors.place ? 'error' : ''}
                readOnly
              />
              <button type="button">주소 검색</button>
            </Box>
            {errors.place && (
              <Text as="p" className="error">
                {errors.place.message}
              </Text>
            )}
          </Box> */}
          <Box className="row">
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <AddressFormField
                  value={field.value}
                  onChange={(newAddress) => {
                    const parts = [
                      newAddress.siName !== '없음' ? newAddress.siName : null,
                      newAddress.guName !== '없음' ? newAddress.guName : null,
                      newAddress.dongName !== '없음' ? newAddress.dongName : null,
                    ].filter(Boolean); // null 값 필터링

                    const combinedPlace = parts.join(' ');

                    field.onChange(newAddress);
                    setValue('place', combinedPlace);
                  }}
                  // showToast={showToast}
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
  );
}
