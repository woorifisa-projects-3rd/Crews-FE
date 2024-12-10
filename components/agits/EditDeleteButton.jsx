'use client';
import { deleteFeed } from '@/apis/agitsAPI';
import { ButtonM, Toast } from '../common';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks';

export default function EditDeleteButton({ agitId, feedId }) {
  const router = useRouter();
  const { toast, setToast, toastMessage, showToast } = useToast();
  const handleDelete = async () => {
    try {
      const response = await deleteFeed(agitId, feedId);
      if (response.statusCodeValue === 200) {
        showToast('삭제되었습니다.');

        // 2초 딜레이 후 페이지 이동
        setTimeout(() => {
          router.replace(`/service/agits/${agitId}/feeds`);
        }, 2000);
      } else {
        alert('삭제 실패');
      }
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
      alert('서버 오류로 삭제에 실패했습니다.');
    }
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
