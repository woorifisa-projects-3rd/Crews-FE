'use client';
import { Box, Flex, Text } from '@radix-ui/themes';
import { ButtonL, Label, Title, Toast } from '../common';
import useSWR from 'swr';
import { getIntroducingForEdit, updateIntroducing } from '@/apis/agitsAPI';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { deleteFileFromS3, getSignedS3Url, uploadFileToS3 } from '@/utils/s3utills';
import { useToast } from '@/hooks';

export default function IntroduceEditForm({ agitId }) {
  const [isClient, setIsClient] = useState(false);
  const [existingFile, setExistingFile] = useState('');
  const { toast, setToast, toastMessage, showToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const { data: introducing } = useSWR(`agits/${agitId}/introducing/edit`, async () => {
    const response = await getIntroducingForEdit(agitId);
    console.log('get data:', response);
    return response;
  });
  if (introducing?.errorCode) {
    throw new Error(introducing.message);
  }
  const [fileName, setFileName] = useState(introducing?.image || '');
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setValue('file', file);
    }
  };
  const [selectedInterests, setSelectedInterests] = useState([]);
  const toggleInterest = (interestId) => {
    setSelectedInterests((prev) => {
      const updated = prev.includes(interestId) ? prev.filter((item) => item !== interestId) : [...prev, interestId];
      setValue('interests', updated);
      return updated;
    });
  };
  useEffect(() => {
    if (introducing) {
      console.log('Introducing 데이터:', introducing);
      setValue('introduce', introducing.introduce);
      setValue('content', introducing.content);
      if (introducing.interests) {
        const interestIds = introducing.interests.map((item) => item.id);
        setSelectedInterests(interestIds);
        setValue('interests', interestIds);
      }
      if (introducing.image) {
        setFileName(introducing.image);
        setExistingFile(introducing.image); // 기존 파일 저장
      }
    }
  }, [introducing, setValue]);
  const router = useRouter();
  useEffect(() => {
    setIsClient(true);
  }, []);
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
          await deleteFileFromS3(existingFile, 'introduce');
        }

        // S3 업로드 처리
        const { signedUrl, fileName } = await getSignedS3Url(data.file.type, 'introduce');
        await uploadFileToS3(signedUrl, data.file);

        // 새로 업로드된 파일 URL 업데이트
        imageUrl = fileName;
      }

      // 제출할 데이터 준비
      const formData = {
        introduce: data.introduce,
        content: data.content,
        interests: data.interests,
        image: imageUrl, // 업로드된 이미지 URL을 포함
      };

      console.log('Formed data:', formData);

      // 백엔드에 데이터 업데이트 요청
      await updateIntroducing(agitId, formData);

      // 성공 시 페이지 이동
      showToast('수정이 완료되었습니다.');
      router.push(`/service/agits/${agitId}/introduce`);
    } catch (error) {
      console.error('업데이트 중 오류 발생:', error);
      alert('업데이트에 실패했습니다. 다시 시도해주세요.');
    }
  };

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
      <Flex direction="column" gap="10px" className="content">
        <section>
          <form onSubmit={handleSubmit(onSubmit)}>
            {introducing ? (
              <>
                <Flex direction="column" gap="20px">
                  <Flex justify="between">
                    <Title>{introducing.agitName}</Title>
                    <Label style="lime">{introducing.subject}</Label>
                  </Flex>
                  <Flex direction="column" gap="10px">
                    <Box className="row">
                      <Text as="label">소개 이미지</Text>
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
                        한줄 소개
                      </Text>
                      <Box className="input">
                        <input
                          id="introduce"
                          type="text"
                          placeholder="한줄 소개를 입력해주세요"
                          {...register('introduce', {
                            required: '한줄 소개를 입력해주세요.',
                            maxLength: {
                              value: 20,
                              message: '최대 20자까지만 입력할 수 있습니다.',
                            },
                          })}
                          className={errors.introduce ? 'error' : ''}
                        />
                      </Box>
                      {errors.introduce && (
                        <Text as="p" className="error">
                          {errors.introduce.message}
                        </Text>
                      )}
                    </Box>
                    <Box className="row">
                      <Text as="label">모임 특징</Text>
                      <Box className="textarea">
                        <textarea
                          id="content"
                          placeholder="우리 모임만의 특징을 입력해주세요"
                          {...register('content')}
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
                </Flex>
                <Flex direction="column" gap="20px" mt="26px">
                  <Box className="row">
                    <Text as="label" className="require">
                      관심사
                    </Text>
                    <div className="interest_list">
                      <Flex gap="10px" wrap="wrap" asChild>
                        <ul>
                          <li>
                            <input
                              type="checkbox"
                              id="interest-1"
                              checked={selectedInterests.includes(1)}
                              onChange={() => toggleInterest(1)}
                            />
                            <label htmlFor="interest-1">등산</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="interest-2"
                              checked={selectedInterests.includes(2)}
                              onChange={() => toggleInterest(2)}
                            />
                            <label htmlFor="interest-2">조기축구회</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="interest-3"
                              checked={selectedInterests.includes(3)}
                              onChange={() => toggleInterest(3)}
                            />
                            <label htmlFor="interest-3">해양 스포츠</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="interest-4"
                              checked={selectedInterests.includes(4)}
                              onChange={() => toggleInterest(4)}
                            />
                            <label htmlFor="interest-4">클라이밍</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="interest-5"
                              checked={selectedInterests.includes(5)}
                              onChange={() => toggleInterest(5)}
                            />
                            <label htmlFor="interest-5">피트니스</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="interest-6"
                              checked={selectedInterests.includes(6)}
                              onChange={() => toggleInterest(6)}
                            />
                            <label htmlFor="interest-6">러닝</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="interest-7"
                              checked={selectedInterests.includes(7)}
                              onChange={() => toggleInterest(7)}
                            />
                            <label htmlFor="interest-7">요가 및 필라테스</label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              id="interest-8"
                              checked={selectedInterests.includes(8)}
                              onChange={() => toggleInterest(8)}
                            />
                            <label htmlFor="interest-8">격투기</label>
                          </li>
                          {errors.interests && (
                            <Text as="p" className="error">
                              {errors.interests.message}
                            </Text>
                          )}
                        </ul>
                      </Flex>
                      <Text as="p" size="2" weight="medium" className="gray_t1" mt="5px">
                        최소 1개에서 3개까지 등록할 수 있습니다!
                      </Text>
                    </div>
                  </Box>
                  <ButtonL style="deep" type="submit">
                    수정하기
                  </ButtonL>
                </Flex>
              </>
            ) : (
              <span>Loading...</span>
            )}
          </form>
        </section>
      </Flex>
    </>
  );
}
