'use client';
import { ButtonM, ButtonS, Modal, Title, Toast } from '@/components/common';
import { Box, Card, Flex, Text } from '@radix-ui/themes';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import styles from './AgitCard.module.css';
import Image from 'next/image';
import { useModal, useToast } from '@/hooks';
import { useState } from 'react';
import instance from '@/apis/instance';
import useSWR, { mutate } from 'swr';
import { detachAgitCard } from '@/apis/mypageAPI';

export default function AgitCard(cardData) {
  const { data } = useSWR('members/me/agits-cards', () => instance.get('members/me/agits-cards'), {
    fallbackData: cardData.agitCardData,
  });
  const [selectedCard, setSelectedCard] = useState(null);
  const { isOpen: isDetachOpen, openModal: openDetachModal, closeModal: closeDetachModal } = useModal();
  const { toast, setToast, toastMessage, showToast } = useToast();

  const handleDeleteCrad = async () => {
    const response = detachAgitCard(selectedCard);
    if (response?.errorCode) {
      console.error(`카드 삭제 실패: ${response.message}`);
      showToast('카드 삭제에 실패했습니다.');
    } else {
      alert('성공적으로 삭제 되었습니다.');
      closeDetachModal();
      mutate('members/me/agits-cards');
    }
  };
  const handleDetachClick = (cardId) => {
    setSelectedCard(cardId);
    console.log(selectedCard);
    openDetachModal();
  };

  return (
    <Flex direction="column" gap="20px">
      <Toast as="alert" isActive={toast} onClose={() => setToast(false)} autoClose={1500}>
        <Text>{toastMessage}</Text>
      </Toast>
      <Title>모임카드</Title>
      <Swiper slidesPerView={'auto'} spaceBetween={20} className={`swiper ${styles.swiper}`}>
        {data.map((card, i) => (
          <SwiperSlide key={`slide${i}`}>
            <Card>
              <Flex align="center" gap="10px">
                <Box className={styles.img_box}>
                  <Box className="back_img" style={{ backgroundImage: `url(${card.cardImage})` }}>
                    <Image src="/imgs/img_bg_asset_card.jpg" width={47} height={73} alt={`카드 이미지`} />
                  </Box>
                </Box>
                <Box className={styles.txt_box}>
                  <Text as="p" size="2" weight="medium">
                    {card.cardName}
                  </Text>
                  <Text as="span" size="1" weight="medium">
                    {card.maskedCardNum}
                  </Text>
                </Box>
              </Flex>
            </Card>
            <Flex direction="column" gap="10px" className={styles.btn_box} pt="1">
              <Text as="p" size="2" weight="medium">
                {card.agitName}
              </Text>
              <ButtonS style="light" onClick={() => handleDetachClick(card.cardId)}>
                해지하기
              </ButtonS>
            </Flex>
          </SwiperSlide>
        ))}
      </Swiper>
      <Modal
        isOpen={isDetachOpen}
        closeModal={closeDetachModal}
        header={{
          title: (
            <>
              모임카드를 <i className="dpb"></i>
              해지 하시겠습니까?
            </>
          ),
        }}
        footer={
          <ButtonM
            leftButton={{ text: '취소', onClick: closeDetachModal }}
            rightButton={{ text: '해지', onClick: handleDeleteCrad }}
          />
        }
      />
    </Flex>
  );
}
