'use client';

import { deleteFeed } from '@/apis/agitsAPI';
import { ButtonM, Toast } from '../common';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks';

export default function EditDeleteButton({ agitId, feedId }) {
  const router = useRouter();
  const { toast, setToast, toastMessage, showToast } = useToast();
  const handleDelete = async () => {
    const response = await deleteFeed(agitId, feedId);

    if (response?.errorCode) {
      // throw new Error(response.message);
      showToast('삭제 실패');
      return;
    }

    showToast('삭제되었습니다.');

    // 2초 딜레이 후 페이지 이동
    setTimeout(() => {
      router.push(`/service/agits/${agitId}/feeds`);
    }, 2000);
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
      <ButtonM
        leftButton={{
          as: 'link',
          href: `/service/agits/${agitId}/feeds/${feedId}/edit`,
          text: '수정',
        }}
        rightButton={{ text: '삭제', onClick: handleDelete }}
      />
    </>
  );
}
