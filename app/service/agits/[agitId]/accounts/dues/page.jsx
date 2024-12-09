import { getAllAccounts, getCommonDues, getDues, getMyAccountHistory } from '@/apis/agitsAPI';
import DateOfDues from '@/components/agits/Account/dues/DateOfDues';
import { Header } from '@/components/common';

import { Flex } from '@radix-ui/themes';

export default async function Page({ params }) {
  const commonDues = await getCommonDues(params.agitId);
  if (commonDues?.errorCode) {
    throw new Error(commonDues.message);
  }
  const today = new Date();
  const date = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  };
  const history = await getMyAccountHistory(date);
  if (history?.errorCode) {
    throw new Error(history.message);
  }
  const allAccounts = await getAllAccounts(date);
  if (allAccounts?.errorCode) {
    throw new Error(allAccounts.message);
  }
  const dues = await getDues(params.agitId, date);
  if (dues?.errorCode) {
    throw new Error(dues.message);
  }
  return (
    <div className="page">
      <header>
        <Header side="center">회비 납부</Header>
      </header>
      <Flex direction="column" gap="10px" className="content">
        <DateOfDues
          agitId={params.agitId}
          dues={dues}
          commonDues={commonDues}
          allAccounts={allAccounts}
          history={history}
        ></DateOfDues>
      </Flex>
    </div>
  );
}
