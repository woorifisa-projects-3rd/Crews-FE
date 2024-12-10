'use client';
import { Box, Card, Flex, Strong, Text } from '@radix-ui/themes';
import styles from './FeePayment.module.css';
import { Suspense, useState } from 'react';
import Image from 'next/image';
import { ButtonL, Modal, PinNumber, SelectFilter } from '@/components/common';
import { useModal } from '@/hooks';
import { CDN_URL } from '@/constants/auth';

export default function FeePayment({ agitId, data, yearAndMonth }) {
  const crewaccountlist = data.crewAccountList;
  const personalaccountlist = data.personalAccountList.map((account) => ({
    ...account,
    text: account.productName,
  }));
  const selectedCrewAccouont = crewaccountlist.find((item) => item.agitId == agitId);
  const [selectedAccount, setSelectedAccount] = useState(personalaccountlist[0]);
  const handleSelect = (filter, params) => {
    const selected = personalaccountlist.find((item) => item.params === params);
    setSelectedAccount(selected);
  };

  const { isOpen: pinIsOpen, openModal: pinOpenModal, closeModal: pinCloseModal } = useModal();
  const pinData = {
    agitId: agitId,
    recvAccountNumber: selectedCrewAccouont?.accountNumber,
    accountId: selectedAccount?.accountId,
    amount: selectedCrewAccouont?.duesAmount,
    year: yearAndMonth?.year,
    month: yearAndMonth?.month,
  };
  return (
    <Flex direction="column" gap="20px">
      <Flex direction="column" gap="10px">
        <Card>
          <Flex align="center" gap="10px">
            <Box className={styles.img_box}>
              <Box
                className="back_img"
                style={{
                  backgroundImage: `url(${selectedCrewAccouont.bankImage == '' || selectedCrewAccouont.bankImage == null ? '/imgs/img_bg_bank.jpg' : CDN_URL + selectedCrewAccouont.bankImage})`,
                }}
              >
                <Image src={'/imgs/img_bg_bank.jpg'} width={36} height={36} alt={selectedCrewAccouont?.bankName} />
              </Box>
            </Box>
            <Flex direction="column" gap="2px">
              <Text as="p" size="2" weight="medium">
                {selectedCrewAccouont?.productName}
              </Text>
              <Text as="p" size="3" className="gray_t2">
                {selectedCrewAccouont?.accountNumber}
              </Text>
            </Flex>
          </Flex>
        </Card>
      </Flex>
      <Flex direction="column">
        <Box align="center">
          <Image src="/icons/ico_up_arrow.svg" width={30} height={30} alt="up arrow" />
        </Box>
        <Flex direction="column" gap="10px">
          <SelectFilter filter="location" selectList={personalaccountlist} onSelect={handleSelect}>
            {personalaccountlist[0].productName}
          </SelectFilter>
          <Card>
            <Flex justify="between" align="center">
              <Strong>
                <span className="underline">{selectedAccount.productName}</span>
              </Strong>
              <Text size="3" className="gray_t2">
                에서
              </Text>
            </Flex>
            <Flex justify="between" align="center">
              <Strong>{selectedCrewAccouont?.duesAmount?.toLocaleString('ko-KR')}</Strong>
              <Text size="2" className="gray_t2">
                원 만큼
              </Text>
            </Flex>
          </Card>
          <ButtonL style="deep" onClick={pinOpenModal}>
            이체하기
          </ButtonL>
        </Flex>
      </Flex>
      <Modal
        isOpen={pinIsOpen}
        closeModal={pinCloseModal}
        header={{
          title: (
            <>
              <span className="underline">PIN번호를 인증</span>해 주세요.
            </>
          ),
          text: '정확히 일치해야 합니다.',
        }}
      >
        <Suspense>
          <PinNumber defaultStage={'auth'} defaultStatus={'transferAgit'} data={pinData} closeModal={pinCloseModal} />
        </Suspense>
      </Modal>
    </Flex>
  );
}
