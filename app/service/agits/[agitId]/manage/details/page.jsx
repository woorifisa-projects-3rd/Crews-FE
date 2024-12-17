import { Header, Title } from '@/components/common';
import { Box, Flex } from '@radix-ui/themes';
import ProfileCardList from '@/components/agits/Manage/ProfileCardList';
import { agitAccountManage } from '@/apis/agitsAPI';

export default async function Page({ params }) {
  const accountManage = await agitAccountManage(params.agitId);
  if (accountManage?.errorCode) {
    throw new Error(accountManage.message);
  }
  console.log(accountManage);

  return (
    <div className="page">
      <Header side="center">아지트 멤버</Header>
      <Box className="content">
        <section>
          <Flex direction="column" gap="20px">
            <Title>총 {accountManage.currentMember}명</Title>
            <ProfileCardList agitId={params.agitId} status="account" members={accountManage.members} />
          </Flex>
        </section>
      </Box>
    </div>
  );
}
