'use client';
import { ButtonS, Modal } from '@/components/common';
import useModal from '@/hooks/useModal';
import { Flex } from '@radix-ui/themes';
import DuesModalContent from './DuesModalContent';

export default function DuesModal({ agitId, yearAndMonth }) {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <Flex justify="center" mt="20px">
      <ButtonS
        style="light"
        icon={{ src: '/icons/ico_setting.svg', width: '14', height: '14', alt: '설정' }}
        onClick={openModal}
      >
        회비설정
      </ButtonS>
      <Modal isOpen={isOpen} closeModal={closeModal} header={{ title: '회비 설정을 변경하시겠습니까?' }}>
        <DuesModalContent agitId={agitId} closeModal={closeModal} yearAndMonth={yearAndMonth}></DuesModalContent>
      </Modal>
    </Flex>
  );
}
