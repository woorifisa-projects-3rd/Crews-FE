'use client';

import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Callout } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import ArrowButton from './ArrowButton';
import FeePayment from './FeePayment';
import { getAllAccounts, getDues, getMyAccountHistory } from '@/apis/agitsAPI';
import TransferHistory from './TransferHistory';
import useSWR from 'swr';

const DateOfDues = ({ agitId, dues, commonDues, allAccounts, history }) => {
  const [yearAndMonth, setYearAndMonth] = useState({});

  const handleDateChange = (newDate) => {
    setYearAndMonth(newDate);
  };
  const { data, mutate } = useSWR(
    yearAndMonth.year && yearAndMonth.month && `accounts/history?year=${yearAndMonth.year}&month=${yearAndMonth.month}`,
    async () => {
      const response = await getMyAccountHistory(yearAndMonth);
      return response;
    },
    {
      fallbackData: history,
      revalidateOnFocus: false,
    },
  );
  const { data: filteredDues, mutate: filteredMutate } = useSWR(
    yearAndMonth.year &&
      yearAndMonth.month &&
      `agits/${agitId}/dues?year=${yearAndMonth.year}&month=${yearAndMonth.month}`,
    async () => {
      const response = await getDues(agitId, yearAndMonth);
      return response;
    },
    {
      fallbackData: dues,
      revalidateOnFocus: false,
    },
  );
  const { data: AllAccountsInfo, mutate: allMutate } = useSWR(
    yearAndMonth.year && yearAndMonth.month && `accounts?year=${yearAndMonth.year}&month=${yearAndMonth.month}`,
    async () => {
      const response = await getAllAccounts(yearAndMonth);
      return response;
    },
    {
      fallbackData: allAccounts,
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    if (yearAndMonth.year && yearAndMonth.month) {
      mutate();
      filteredMutate();
      allMutate();
    }
  }, [yearAndMonth.year, yearAndMonth.month]);

  const isFullyPaid =
    yearAndMonth.year &&
    yearAndMonth.month &&
    (filteredDues?.dueAmount === null || filteredDues?.dueAmount === undefined || filteredDues?.dueAmount === 0.0);
  return (
    <>
      <section>
        <ArrowButton data={commonDues} handleDateChange={handleDateChange}></ArrowButton>
        {isFullyPaid ? (
          <Callout.Root color="green">
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>납부완료!</Callout.Text>
          </Callout.Root>
        ) : (
          <Callout.Root color="red" mt="3">
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>
              회비 납부일이 지났어요! 빨리 {filteredDues?.dueAmount?.toLocaleString('ko-KR')}원을 납부해주세요.
            </Callout.Text>
          </Callout.Root>
        )}
      </section>
      {!isFullyPaid && (
        <section>
          <FeePayment agitId={agitId} data={AllAccountsInfo} yearAndMonth={yearAndMonth}></FeePayment>
        </section>
      )}
      <section>
        <TransferHistory transactionData={data}></TransferHistory>
      </section>
    </>
  );
};

export default DateOfDues;
