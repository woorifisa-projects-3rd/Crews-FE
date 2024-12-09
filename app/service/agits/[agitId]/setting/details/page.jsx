import { Header, Title } from '@/components/common';
import { Box, Flex } from '@radix-ui/themes';
import ProfileCardList from '@/components/agits/ProfileCardList';
import { agitManage } from '@/apis/agitsAPI';
export default async function Page({ params }) {
  const manage = await agitManage(params.agitId);
  if (manage?.errorCode) {
    throw new Error(manage.message);
  }
  return (
    <div className="page">
      <Header side="center">아지트 통장권한 신청</Header>
      <Box className="content">
        <section>
          <Flex direction="column" gap="20px">
            <Title>총 {manage.advancedMember}명</Title>
            <ProfileCardList agitId={params.agitId} status="member" members={manage.advancedMembers} />
          </Flex>
        </section>
      </Box>
    </div>
  );
}
