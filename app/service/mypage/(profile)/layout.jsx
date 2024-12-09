import { getProfile } from '@/apis/mypageAPI';
import { Header, TabMenu } from '@/components/common';
import ProfileCard from '@/components/mypage/ProfileCard/ProfileCard';
import { tabMenuList } from '@/constants/tabMenuList/mypage';

export default async function Layout({ children }) {
  const profileData = await getProfile();

  if (profileData?.errorCode) {
    throw new Error(profileData.message);
  }
  return (
    <div className="page">
      <Header side="left">마이페이지</Header>
      <div className="content">
        <section>
          <ProfileCard profileData={profileData} />
        </section>
        <TabMenu tabMenuList={tabMenuList} baseUrl={'/service/mypage'}></TabMenu>
        <section>{children}</section>
      </div>
    </div>
  );
}
