import { getMyAgitCards, getPersonalAccounts } from '@/apis/mypageAPI';
import { ButtonL } from '@/components/common';
import AgitCard from '@/components/mypage/assets/AgitCard';
import MyAccount from '@/components/mypage/assets/MyAccount';
import { Flex } from '@radix-ui/themes';

export default async function Page() {
  const agitCardData = await getMyAgitCards();
  if (agitCardData?.errorCode) {
    throw new Error(agitCardData.message);
  }

  const accountData = (await getPersonalAccounts()) || [];
  if (accountData?.errorCode) {
    throw new Error(accountData.message);
  }

  return (
    <Flex direction="column" gap="20px">
      <MyAccount data={accountData} />
      {agitCardData.length > 0 ? <AgitCard agitCardData={agitCardData} /> : null}
      <ButtonL as="link" href="/service/mypage/fee" style="deep">
        회비 납부하기
      </ButtonL>
    </Flex>
  );
}
