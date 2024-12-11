'use client';
import { ButtonM, ButtonS, Modal, Title, Toast } from '@/components/common';
import { Box, Card, Flex, Text } from '@radix-ui/themes';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import styles from './MyAccount.module.css';
import Image from 'next/image';
import MyDataList from './MyDataList';
import { useModal, useToast } from '@/hooks';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { useState } from 'react';
import { attachBankAccount, detachPersonalAccount, getBankAccount } from '@/apis/mypageAPI';
import instance from '@/apis/instance';
import { CDN_URL } from '@/constants/auth';

export default function MyAccount({ data: fallbackData }) {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const { toast, setToast, toastMessage, showToast } = useToast();

  const { isOpen: isDetachOpen, openModal: openDetachModal, closeModal: closeDetachModal } = useModal();
  const { isOpen: isAttachOpen, openModal: openAttachModal, closeModal: closeAttachModal } = useModal();
  const router = useRouter();
  const { data = [] } = useSWR('members/me/my-account', () => instance.get('members/me/my-account'), {
    fallbackData,
  });

  const {
    data: bankAccounts,
    error: bankAccountsError,
    isValidating,
  } = useSWR(isAttachOpen ? 'members/me/agits-account-info' : null, () => getBankAccount(), {
    revalidateOnFocus: false,
  });

  const handleDeleteAccount = async () => {
    const response = await detachPersonalAccount(selectedAccount);
    if (response?.errorCode) {
      console.error(`계좌 해지 실패: ${response.message}`);
      showToast('계좌 해지에 실패했습니다.');
    } else {
      alert('성공적으로 해지 되었습니다.');
      closeDetachModal();
      router.refresh();
    }
  };

  const handleDetachClick = (accountd) => {
    setSelectedAccount(accountd);
    openDetachModal();
  };

  // 계좌 연결 클릭 핸들러
  const handleAttachClick = () => {
    openAttachModal();
  };

  // 자산 선택 핸들러
  const handleAssetSelect = (accountNumber) => {
    setSelectedAssets((prevSelected) => {
      if (prevSelected.includes(accountNumber)) {
        return prevSelected.filter((num) => num !== accountNumber);
      } else {
        return [...prevSelected, accountNumber];
      }
    });
  };

  // 선택된 자산 연결 핸들러
  const handleAttachAssets = async () => {
    closeAttachModal();
    const response = await attachBankAccount(selectedAssets);
    if (response?.errorCode) {
      showToast('자산 연결에 실패했습니다.');
      console.error('자산 연결 실패:', response.message);
    } else {
      alert('자산이 성공적으로 연결되었습니다.');
      router.push('/service/mypage/assets');
    }
    setSelectedAssets([]);
  };

  return (
    <Flex direction="column" gap="20px">
      <Toast as="alert" isActive={toast} onClose={() => setToast(false)} autoClose={1500}>
        <Text>{toastMessage}</Text>
      </Toast>
      <Title>내 통장</Title>
      <Swiper slidesPerView={'auto'} spaceBetween={20} className={`swiper ${styles.swiper}`}>
        <Swiper slidesPerView={'auto'} spaceBetween={20} className={`swiper ${styles.swiper}`}>
          {data.map((account) => (
            <SwiperSlide key={account.accountId}>
              <Card>
                <Flex align="center" gap="10px">
                  <Box className={styles.img_box}>
                    <Box
                      className={`${styles.img} back_img`}
                      style={{ backgroundImage: `url(${CDN_URL}${account.bankImage})` }}
                    >
                      <Image src="/imgs/img_bg_bank.jpg" width={36} height={36} alt={`${account.accountName} 이미지`} />
                    </Box>
                  </Box>
                  <Box className={styles.txt_box}>
                    <Flex gap="15px">
                      <Text as="p" size="1" weight="medium">
                        {account.accountName}
                      </Text>
                      <Text as="p" size="1" weight="medium">
                        {account.accountNumber}
                      </Text>
                    </Flex>
                    <b>{account.balance.toLocaleString()}원</b>
                  </Box>
                </Flex>
              </Card>
              <Flex direction="column" gap="10px" className={styles.btn_box} pt="1">
                <ButtonS style="light" onClick={() => handleDetachClick(account.accountId)}>
                  해지하기
                </ButtonS>
              </Flex>
            </SwiperSlide>
          ))}
        </Swiper>
        <SwiperSlide className={styles.blank}>
          <Card className="card_link">
            <button onClick={handleAttachClick} className={styles.linkButton}>
              <Flex align="center" gap="10px">
                <Box className={styles.img_box}>
                  <Box
                    className={`${styles.img} back_img`}
                    style={{ backgroundImage: `url(/icons/ico_blank_plus.svg)` }}
                  >
                    <Image src="/imgs/img_bg_bank.jpg" width={36} height={36} alt={`계좌 연결하기`} />
                  </Box>
                </Box>
                <Box className={styles.txt_box}>
                  <Text as="p" size="2" weight="medium">
                    개인 계좌를 연결하고 <i className="dpb"></i>
                    모임 회비를 간단하게 납부/관리 해보세요.
                  </Text>
                </Box>
              </Flex>
            </button>
          </Card>
        </SwiperSlide>
      </Swiper>
      {/* Modals */}
      <Modal
        isOpen={isDetachOpen}
        closeModal={closeDetachModal}
        header={{
          title: (
            <>
              연결된 개인 계좌를 <i className="dpb"></i>
              삭제 하시겠습니까?
            </>
          ),
        }}
        footer={
          <ButtonM
            leftButton={{ text: '취소', onClick: closeDetachModal }}
            rightButton={{ text: '해지', onClick: handleDeleteAccount }}
          />
        }
      />
      <Modal
        isOpen={isAttachOpen}
        closeModal={closeAttachModal}
        header={{
          title: `자산 연결`,
          text: `마이데이터를 불러옵니다.`,
        }}
      >
        <Flex direction="column" gap="3">
          {isValidating ? (
            <Text>로딩 중...</Text>
          ) : bankAccountsError ? (
            <Text color="red">데이터를 불러오는 데 실패했습니다.</Text>
          ) : (
            <MyDataList
              data={bankAccounts}
              selectedAssets={selectedAssets}
              onSelect={handleAssetSelect}
              onConnect={handleAttachAssets}
            />
          )}
        </Flex>
      </Modal>
    </Flex>
  );
}
