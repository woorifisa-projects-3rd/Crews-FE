'use client';

import { useState } from 'react';
import AccountHistoryFilter from './AccountHistoryFilter';
import AccountDetail from './AccountDetail';
import { getAccountDetails } from '@/apis/agitsAPI';
import useSWR from 'swr';
import { Box } from '@radix-ui/themes';

export default function AccountHistory({ agitId, accountDetails }) {
  const [filter, setFilter] = useState({});

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };
  const { data: accountHistory } = useSWR(
    filter.selectedMonth &&
      filter.selectedTranType &&
      filter.selectedOrder &&
      `agits/${agitId}/accounts/details?selectPeriod=${filter.selectedMonth}&transactionType=${filter.selectedTranType}&order=${filter.selectedOrder}`,
    async () => {
      const response = await getAccountDetails(
        agitId,
        filter.selectedMonth,
        filter.selectedTranType,
        filter.selectedOrder,
      );
      return response;
    },
    {
      fallbackData: accountDetails,
    },
  );
  return (
    <section>
      <AccountHistoryFilter handleFilterChange={handleFilterChange}></AccountHistoryFilter>
      <Box mt="1">
        <ul>
          {accountHistory?.tranList?.map((detail, i) => {
            return <AccountDetail data={detail} key={`detail${i}`} />;
          })}
        </ul>
      </Box>
    </section>
  );
}
