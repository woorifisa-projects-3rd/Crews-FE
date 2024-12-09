'use client';
import { Box, Flex, RadioGroup, Text } from '@radix-ui/themes';
import { AddressFormField, Header } from '@/components/common';
import { Controller, useForm } from 'react-hook-form';
import { ButtonL, Toast } from '@/components/common';
import { useState } from 'react';
import scrollToTop from '@/utils/scrollToTop';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks';
import { isAddressEmpty } from '@/utils/address';
import { createAgitRequest, validateAgitName } from '@/apis/agitsAPI';
import { NONE } from '@/constants/address';
export default function AgitCreateForm({ subjects }) {
  const [currentSubject, setCurrentSubject] = useState(subjects[0]?.subjectId || 1);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [asState, setAsState] = useState('alert');
  const { toast, setToast, toastMessage, showToast } = useToast();
  const [isUsed, setIsUsed] = useState('nonClick');

  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = useForm();

  const DuplicateCheck = async () => {
    if (getValues('name').length === 0) {
      scrollToTop();
      setAsState('alert');
      showToast('아지트 이름을 입력해주세요.');
      return;
    }

    const validateAgitNameData = await validateAgitName(getValues('name'));
    if (validateAgitName.errorCode) {
      showToast(validateAgitName.message);
    }
    if (validateAgitNameData?.used) {
      scrollToTop();
      setAsState('alert');
      showToast('이미 사용중인 아지트 이름입니다.');
      setIsUsed(true);
      return;
    } else {
      scrollToTop();
      setAsState('info');
      showToast('사용 가능한 아지트 이름입니다.');
      setIsUsed(false);
    }
  };

  const changeSubject = async (value) => {
    setCurrentSubject(parseInt(value, 10));
  };

  const handleOnSubmit = async (data) => {
    setAsState('alert');
    if (isUsed === 'nonClick') {
      scrollToTop();
      showToast('아지트 이름 중복을 확인해주세요!');
      return;
    } else if (isUsed) {
      scrollToTop();
      showToast('사용중인 아지트 이름으로 생성할 수 없습니다.');
      return;
    }
    if (selectedInterests.length < 1) {
      scrollToTop();
      showToast('관심사를 1개 이상 선택해주세요!');
      return;
    } else if (selectedInterests.length >= 4) {
      scrollToTop();
      showToast('관심사를 3개 이하로 선택해주세요!');
      return;
    }

    const isEmpty = isAddressEmpty(data.address);
    if (isEmpty) {
      showToast('활동 지역을 설정해주세요!');
      return;
    }

    const address = {
      doName: data.address.doName || NONE,
      siName: data.address.siName || NONE,
      guName: data.address.guName || NONE,
      dongName: data.address.dongName || NONE,
    };

    const agitData = { ...data, subject: currentSubject, interests: selectedInterests, addressRequest: address };

    const response = await createAgitRequest(agitData);
    if (response?.errorCode) {
      showToast(response.message);
    } else {
      console.log('response', response);
      console.log('response.id', response.id);
      router.push(`/service/agits/create/done?q=${response.id}`);
    }
  };

  const toggleInterest = (interestId) => {
    setSelectedInterests((prev) => {
      const newSelected = prev.includes(interestId) ? prev.filter((id) => id !== interestId) : [...prev, interestId];
      return newSelected;
    });
  };

  return (
    <div className="page">
      <Header side="center">아지트 생성</Header>
      <Toast as={asState} isActive={toast} onClose={() => setToast(false)}>
        <Text>{toastMessage}</Text>
      </Toast>
      <div className="content">
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <Flex direction="column" gap="10px" className="content">
            <Flex direction="column" gap="10px" asChild>
              <section>
                <Box className="row">
                  <Text as="label" htmlFor="name" className="require">
                    아지트 이름
                  </Text>
                  <Box className="input input_btn">
                    <input
                      type="text"
                      id="name"
                      placeholder="아지트 이름을 입력해주세요!"
                      {...register('name', {
                        required: '아지트 이름을 입력해주세요.',
                        maxLength: {
                          value: 20,
                          message: '최대 20자까지만 입력할 수 있습니다.',
                        },
                      })}
                      onChange={() => setIsUsed('nonClick')}
                      className={errors.name ? 'error' : ''}
                    />
                    <button type="button" onClick={DuplicateCheck}>
                      중복확인
                    </button>
                  </Box>
                  {errors.name && (
                    <Text as="p" className="error">
                      {errors.name.message}
                    </Text>
                  )}
                </Box>
                <Box className="row">
                  <Controller
                    name="address"
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
                  <Text as="label" htmlFor="introduction" className="require">
                    아지트 한 줄 소개
                  </Text>
                  <Box className="input">
                    <input
                      type="text"
                      id="introduction"
                      placeholder="한 줄 소개를 입력해주세요!"
                      {...register('introduction', {
                        required: '한 줄 소개를 입력해주세요.',
                        maxLength: {
                          value: 30,
                          message: '최대 30자까지만 입력할 수 있습니다.',
                        },
                      })}
                      className={errors.introduction ? 'error' : ''}
                    />
                  </Box>
                  {errors.introduction && (
                    <Text as="p" className="error">
                      {errors.introduction.message}
                    </Text>
                  )}
                </Box>
              </section>
            </Flex>
            <Flex direction="column" gap="10px" asChild>
              <section>
                <Text as="label" htmlFor="topic" className="require" weight="bold">
                  아지트 주제
                </Text>
                <Box className="radio_group">
                  <RadioGroup.Root
                    size="6"
                    defaultValue="2"
                    value={currentSubject.toString()}
                    name="topic"
                    onValueChange={(value) => changeSubject(value)}
                  >
                    {subjects.map((subject) => (
                      <Box className="radio" key={`subjectRadio${subject.subjectId}`}>
                        <RadioGroup.Item value={subject.subjectId.toString()}>{subject.subjectName}</RadioGroup.Item>
                      </Box>
                    ))}
                  </RadioGroup.Root>
                </Box>
              </section>
            </Flex>
            <Flex direction="column" gap="10px" asChild>
              <section>
                <Flex direction="column" gap="20px">
                  <Flex direction="column" gap="20px">
                    <Box className="row">
                      <Text as="label" className="require">
                        관심사
                      </Text>
                      <Text as="p" size="2" weight="medium" className="gray_t1">
                        {getValues('name')} 모임의 관심사는 무엇인가요? <i className="dpb"></i>
                        {getValues('name')} 모임의 관심사를 기반으로 사람들에게 알려요.
                      </Text>
                    </Box>
                    <div className="interest_list">
                      <Flex gap="10px" wrap="wrap" asChild>
                        <ul>
                          {subjects
                            .find((subject) => subject.subjectId === currentSubject)
                            ?.interests.map((interest) => (
                              <li key={`interest${interest.interestingId}`}>
                                <input
                                  type="checkbox"
                                  id={`interest-${interest.interestingId}`}
                                  checked={selectedInterests.includes(interest.interestingId)}
                                  onChange={() => toggleInterest(interest.interestingId)}
                                />
                                <label htmlFor={`interest-${interest.interestingId}`}>{interest.name}</label>
                              </li>
                            ))}
                        </ul>
                      </Flex>
                      <Text as="p" size="2" weight="medium" className="gray_t1" mt="5px">
                        최소 1개에서 3대까지 등록할 수 있습니다!
                      </Text>
                    </div>
                  </Flex>
                  <ButtonL type="submit" style="deep">
                    생성하기
                  </ButtonL>
                </Flex>
              </section>
            </Flex>
          </Flex>
        </form>
      </div>
    </div>
  );
}
