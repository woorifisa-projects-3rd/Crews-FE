'use client';
import { Box, Flex, Text } from '@radix-ui/themes';
import { ButtonM, Modal } from '../common';
import styles from './ProfileCardList.module.css';
import { useModal } from '@/hooks';
import Image from 'next/image';
import { accountAuthorization, memberAuthorization } from '@/apis/agitsAPI';

export default function ProfileCardList({ agitId, status, members }) {
  const { isOpen: isMemberInOutOpen, openModal: openMemberInOutModal, closeModal: closeMemberInOutModal } = useModal();
  const { isOpen: isAccountUseOpen, openModal: openAccountUseModal, closeModal: closeAccountUseModal } = useModal();
  const handleAcceptMember = async (member) => {
    const formData = {
      status: 'approve',
      requestMemberId: member.id,
    };
    try {
      await memberAuthorization(agitId, formData);
      console.log('가입 신청 수락 완료');
      closeMemberInOutModal();
    } catch (error) {
      console.error('가입 신청 수락 실패', error);
    }
  };

  const handleAcceptAccount = async (member) => {
    const formData = {
      status: 'approve',
      requestMemberId: member.id,
    };
    try {
      await accountAuthorization(agitId, formData);
      console.log('권한 부여 완료');
      closeAccountUseModal();
    } catch (error) {
      console.error('권한 부여 실패', error);
    }
  };
  return (
    <>
      <Modal
        isOpen={isMemberInOutOpen}
        closeModal={closeMemberInOutModal}
        header={{
          title: <>의 가입신청을 수락하시겠습니까?</>,
        }}
        footer={
          <ButtonM
            leftButton={{ text: '거부', onClick: closeMemberInOutModal }}
            rightButton={{ text: '수락', onClick: () => handleAcceptMember({ id: agitId }) }}
          />
        }
      />
      <Modal
        isOpen={isAccountUseOpen}
        closeModal={closeAccountUseModal}
        header={{
          title: <>에게 통장 권한을 부여하시겠습니까?</>,
        }}
        footer={
          <ButtonM
            leftButton={{ text: '거부', onClick: closeAccountUseModal }}
            rightButton={{ text: '수락', onClick: () => handleAcceptAccount({ id: agitId }) }}
          />
        }
      />
      <div className={styles.cardList}>
        <ul>
          {members.map((member) => (
            <li key={member.id}>
              <Flex align="center" gap="20px">
                <Box className={`${styles.img_box} img`}>
                  <Box
                    className="img"
                    style={{
                      backgroundImage: `url(${member.profileImage || '/dev/imgs/img_bg_profile.jpg'})`,
                    }}
                  />
                </Box>
                <Box direction="column" className={styles.txt}>
                  <Text as="p" weight="bold">
                    <span>{member.nickName}</span> 님
                  </Text>
                  <Text as="p" size="2" className="gray_t2">
                    {member.email}
                  </Text>
                </Box>

                {/* 버튼 렌더링 */}
                <button
                  className={`${styles.captain_btn} light`}
                  onClick={status === 'account' ? openAccountUseModal : openMemberInOutModal}
                >
                  {status === 'account' ? '통장 권한 부여' : '가입신청'}
                </button>
              </Flex>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
