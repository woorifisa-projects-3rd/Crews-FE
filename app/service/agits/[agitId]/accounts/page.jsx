import { Flex } from '@radix-ui/themes';
import { getAccount, getAccountDetails } from '@/apis/agitsAPI';
import AgitHeader from '@/components/agits/AgitHeader';
import AccountAndButton from '@/components/agits/Account/AccountAndButton';

import AccountHistory from '@/components/agits/Account/AccountHistory';

export default async function Page({ params }) {
  const data = await getAccount(params.agitId);
  if (data?.errorCode) {
    throw new Error(data.message);
  }
  const accountDetails = await getAccountDetails(params.agitId, 3, 'ALL', 'DESC');
  if (accountDetails?.errorCode) {
    throw new Error(accountDetails.message);
  }

  return (
    <div className="page">
      <AgitHeader currentId={params.agitId} />
      <Flex direction="column" gap="10px" className="content">
        <section>
          <AccountAndButton agitId={params.agitId} data={data}></AccountAndButton>
        </section>
        <AccountHistory agitId={params.agitId} accountDetails={accountDetails}></AccountHistory>
      </Flex>
    </div>
  );
}
