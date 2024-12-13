'use client';

import Modal from '@/components/common/Modal/Modal';
import DaumPostcodeEmbed from 'react-daum-postcode';
import { NONE } from '@/constants/address';
import { stringToObject } from '@/utils/address';

export default function AddressSearchModal({ isOpen, onClose, onSelect, showToast }) {
  const handleCompletePostcode = async (data) => {
    if (!data.jibunAddress) {
      showToast('잘못된 주소입니다. 다시 선택해주세요.');
      onClose();
      return;
    }

    const fullAddress = data.jibunAddress;
    const { doName, siName, guName, dongName } = stringToObject(fullAddress);

    if (siName === NONE || dongName === NONE) {
      showToast('올바른 주소를 선택해주세요.');
      onClose();
      return;
    }

    onSelect({ doName, siName, guName, dongName });
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        closeModal={onClose}
        header={{ title: '주소 검색', text: '주소를 검색하고 선택해 주세요.' }}
      >
        <DaumPostcodeEmbed onComplete={handleCompletePostcode}></DaumPostcodeEmbed>
      </Modal>
    </>
  );
}
