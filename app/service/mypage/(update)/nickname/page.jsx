import { getNickname } from '@/apis/mypageAPI';
import { Header } from '@/components/common';
import NicknameForm from '@/components/mypage/form/NicknameForm';

export default async function page() {
  const nicknameData = await getNickname();

  if (nicknameData?.errorCode) {
    throw new Error(nicknameData.message);
  }
  return (
    <div className="page">
      <Header side="center">닉네임 수정</Header>
      <div className="content">
        <section>
          <NicknameForm nicknameData={nicknameData} />
        </section>
      </div>
    </div>
  );
}
