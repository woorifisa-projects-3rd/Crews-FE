import { getFeePaymentInfo, getPersonalAccounts } from '@/apis/mypageAPI';
import { Header } from '@/components/common';
import MembershipFee from '@/components/mypage/MembershipFee/MembershipFee';
import TransferHistory from '@/components/mypage/assets/TransferHistory';
import { Flex } from '@radix-ui/themes';

export default async function Page() {
  const feePaymentData = await getFeePaymentInfo();
  if (feePaymentData?.errorCode) {
    throw new Error(feePaymentData.message);
  }

  const myAccountData = await getPersonalAccounts();
  if (myAccountData?.errorCode) {
    throw new Error(myAccountData.message);
  }

  return (
    <div className="page">
      <Header side="center">회비 납부</Header>
      <Flex direction="column" gap="10px" className="content">
        <section>
          <MembershipFee crewData={feePaymentData} myData={myAccountData} />
        </section>
        <section>
          <TransferHistory />
        </section>
      </Flex>
    </div>
  );
}
