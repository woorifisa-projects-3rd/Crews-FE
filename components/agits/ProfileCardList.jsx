'use client';
import { Box, Flex, Text } from '@radix-ui/themes';
import { ButtonM, Modal } from '@/components/common';
import styles from './ProfileCardList.module.css';
import { useModal } from '@/hooks';
import Image from 'next/image';
export default function ProfileCardList({ status }) {
  const { isOpen: isMemberInOutOpen, openModal: openMemberInOutModal, closeModal: closeMemberInOutModal } = useModal();
  const { isOpen: isAccountUseOpen, openModal: openAccountUseModal, closeModal: closeAccountUseModal } = useModal();
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
            rightButton={{ text: '수락', onClick: closeMemberInOutModal }}
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
            rightButton={{ text: '수락', onClick: closeAccountUseModal }}
          />
        }
      />
      <div className={styles.cardList}>
        <ul>
          <li>
            <Flex align="center" gap="20px">
              <Box className={`${styles.img_box} img`}>
                <Box className="img" style={{ backgroundImage: `url(/imgs/img_bg_profile.jpg)` }}>
                  <Image src="/imgs/img_bg_profile.jpg" width={56} height={56} alt={`ㅇㅇㅇ 프로필 이미지`} />
                </Box>
              </Box>

              <Box direction="column" className={styles.txt}>
                <Text as="p" weight="bold">
                  <span className="underline">홍길동-가나다라mav</span> 님
                </Text>
                <Text as="p" size="2" className="gray_t2">
                  abc@naver.com
                </Text>
              </Box>
              <button
                className={`${styles.captain_btn} light`}
                onClick={status === 'member' ? openMemberInOutModal : openAccountUseModal}
              >
                {status === 'member' ? '수락/거부' : '통장 권한 부여'}
              </button>
            </Flex>
          </li>
          <li>
            <Flex align="center" gap="20px">
              <Box className={`${styles.img_box} img`}>
                <Box className="img" style={{ backgroundImage: `url(/imgs/img_bg_profile.jpg)` }}>
                  <Image src="/imgs/img_bg_profile.jpg" width={56} height={56} alt={`dddd 프로필 이미지`} />
                </Box>
              </Box>
              {/* <Image src="/imgs/img_bg_profile.jpg" width={56} height={56} /> */}
              <Box direction="column" className={styles.txt}>
                <Text as="p" weight="bold">
                  <span>홍길동-가나다라mav</span> 님
                </Text>
                <Text as="p" size="2" className="gray_t2">
                  abc@naver.com
                </Text>
              </Box>
              <button
                className={`${styles.captain_btn} light`}
                onClick={status === 'member' ? openMemberInOutModal : openAccountUseModal}
              >
                {status === 'member' ? '수락/거부' : '통장 권한 부여'}
              </button>
            </Flex>
          </li>
        </ul>
      </div>
    </>
  );
}
