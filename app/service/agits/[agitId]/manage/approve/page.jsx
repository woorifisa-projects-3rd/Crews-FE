import { Header, Title } from '@/components/common';
import { Box, Flex } from '@radix-ui/themes';
import ProfileCardList from '@/components/agits/Manage/ProfileCardList';
import { agitMemberManage } from '@/apis/agitsAPI';
export default async function Page({ params }) {
  const memberManage = await agitMemberManage(params.agitId);
  if (memberManage?.errorCode) {
    throw new Error(memberManage.message);
  }
  console.log(memberManage);

  return (
    <div className="page">
      <Header side="center">아지트 가입신청</Header>
      <Box className="content">
        <section>
          <Flex direction="column" gap="20px">
            <Title>총 {memberManage.currentMember}명</Title>
            <ProfileCardList agitId={params.agitId} status="member" members={memberManage.members} />
          </Flex>
        </section>
      </Box>
    </div>
  );
}
