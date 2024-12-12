import { Header, Title } from '@/components/common';
import { Box, Flex } from '@radix-ui/themes';
import ProfileCardList from '@/components/agits/ProfileCardList';

export default async function Page({ params }) {
  return (
    <div className="page">
      <Header side="center">아지트 멤버</Header>
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
