'use client';

import { ButtonL } from '@/components/common';
import { Flex, Box, Text } from '@radix-ui/themes';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { getMeetingForEdit } from '@/apis/agitsAPI';
export default function MeetingForm({ agitId, meetingId, status }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const { data: meeting } = useSWR(`agits/${agitId}/meetings/${meetingId}/edit`, async () => {
    const response = await getMeetingForEdit(agitId, meetingId);

    return response;
  });
  if (meeting?.errorCode) {
    throw new Error(meeting.message);
  }
  const onSubmit = async ({ name, image, date, place, content }) => {};
  const [fileName, setFileName] = useState('');
  useEffect(() => {
    if (meeting?.image) {
      setFileName(meeting.image);
    }
  }, [meeting]);
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
    }
  }, [meeting, setValue]);

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
          <Box className="row">
            <Text as="label" className="require">
              모임 위치
            </Text>
            <Box className="input input_btn">
              <input
                id="place"
                type="text"
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
