'use client';
import { deleteFeed } from '@/apis/agitsAPI';
import { ButtonM } from '../common';
import { useRouter } from 'next/navigation';

export default function EditDeleteButton({ agitId, feedId }) {
  const router = useRouter();
  const handleDelete = async () => {
    try {
      const response = await deleteFeed(agitId, feedId);
      if (response.statusCodeValue === 200) {
        alert('삭제되었습니다.');
        router.push(`/service/agits/${agitId}/feeds`);
      } else {
        alert('삭제 실패');
      }
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
      alert('서버 오류로 삭제에 실패했습니다.');
    }
  };
  return (
    <ButtonM
      leftButton={{
        as: 'link',
        href: `/service/agits/${agitId}/feeds/${feedId}/edit`,
        text: '수정',
      }}
      rightButton={{ text: '삭제', onClick: handleDelete }}
    />
  );
}
