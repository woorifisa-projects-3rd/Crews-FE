'use client';
import { EXCLUDED_INTEREST_IDS } from '@/constants/excludedIds';
import { ButtonL, ButtonS, Label, Modal, Toast } from '@/components/common';
import { Box, Flex, Text } from '@radix-ui/themes';
import { useState } from 'react';
import { updateInterests } from '@/apis/mypageAPI';
import { useRouter } from 'next/navigation';
import instance from '@/apis/instance';
import useSWR from 'swr';
import { useNicknameStore } from '@/stores/mypageStore';
import { useModal, useToast } from '@/hooks';

export default function InterestForm({ initialInterests, subjects }) {
  const { data, isLoading } = useSWR('members/me/interests', () => instance.get('members/me/interests'), {
    fallbackData: initialInterests,
  });
  const { data: subjectData } = useSWR('interests', () => instance.get('interests'), {
    fallbackData: subjects,
  });

  const router = useRouter();
  const { nickname } = useNicknameStore();
  // 필터링된 관심사 초기화
  const filteredInitialInterests = data
    ? data.filter((interest) => !EXCLUDED_INTEREST_IDS.includes(interest.interestingId) && interest.interestingId)
    : [];

  // 상태 정의
  const [selectedInterests, setSelectedInterests] = useState(
    filteredInitialInterests.map((interest) => interest.interestingId) || [],
  );

  const { isOpen, openModal, closeModal } = useModal();
  const { toast, setToast, toastMessage, showToast } = useToast();

  // 관심사 선택 토글 함수
  const toggleInterest = (interestId) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId) ? prev.filter((id) => id !== interestId) : [...prev, interestId],
    );
  };

  const handleUpdateInterest = async (e) => {
    e.preventDefault();
    if (selectedInterests.length < 3) {
      showToast('관심사를 3개 이상 선택해주세요!');
      return;
    } else if (selectedInterests.length > 10) {
      showToast('관심사를 10개 이하로 선택해주세요!');
      return;
    }

    try {
      const payload = {
        interests: selectedInterests.map((id) => ({ interestId: id })),
      };
      await updateInterests(payload);
      closeModal();
      alert('관심사가 성공적으로 저장되었습니다.');
      router.push('/service/mypage');
    } catch (error) {
      console.error('관심사 전송 실패:', error);
      showToast('관심사 저장에 실패했습니다.');
    }
  };

  const getAllInterests = () => {
    openModal();
  };

  return (
    <Box className="input">
      <Toast as="alert" isActive={toast} onClose={() => setToast(false)}>
        <Text>{toastMessage}</Text>
      </Toast>
      <form onSubmit={handleUpdateInterest}>
        <Flex direction="column" gap="5px">
          <Text as="label" weight="bold">
            관심사
          </Text>
          <Flex direction="column" gapY="40px">
            <Flex align="center" wrap="wrap" gap="10px">
              {selectedInterests?.length > 0 ? (
                selectedInterests.map((interestId) => {
                  const interest = subjectData
                    ?.flatMap((subject) => subject.interests)
                    .find((i) => i.interestingId === interestId);
                  if (!interest) return null;
                  return (
                    <Label key={`interest-${interestId}`} style="deep">
                      #{interest.name}
                    </Label>
                  );
                })
              ) : (
                <Text as="p" size="2" className="gray_t2">
                  관심사를 등록하면 맞춤형 모임을 추천해드려요!
                </Text>
              )}
              <ButtonS
                onClick={getAllInterests}
                style="light"
                icon={{ src: '/icons/ico_setting.svg', width: '15', height: '15', alt: '설정' }}
              >
                설정
              </ButtonS>
              <Modal
                isOpen={isOpen}
                closeModal={closeModal}
                footer={
                  <ButtonL style="deep" onClick={closeModal}>
                    확인
                  </ButtonL>
                }
                header={{
                  title: `"${nickname}"님의 관심사는 무엇인가요?`,
                  text:
                    '좋아하거나 알아가고 싶은 관심사를 3개 이상 선택해주세요. ' + '님에게 딱 맞는 모임을 추천해드려요.',
                }}
              >
                <Flex direction="column" gap="20px">
                  {subjectData?.map((subject) => (
                    <Flex direction="column" gap="10px" key={subject.subjectId}>
                      <Text weight="bold">{subject.subjectName}</Text>
                      <div className="interest_list">
                        <Flex gap="10px" wrap="wrap" asChild>
                          <ul>
                            {subject.interests.map((interest) => (
                              <li key={interest.interestingId}>
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
                      </div>
                    </Flex>
                  ))}
                </Flex>
              </Modal>
            </Flex>
            <ButtonL type="submit" style="deep" disabled={isLoading}>
              {isLoading ? '처리 중...' : '수정'}
            </ButtonL>
          </Flex>
        </Flex>
      </form>
    </Box>
  );
}
