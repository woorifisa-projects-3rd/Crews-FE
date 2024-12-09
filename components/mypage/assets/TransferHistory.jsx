'use client';
import { Flex, Text } from '@radix-ui/themes';
import styles from './TransferHistory.module.css';
import { Title } from '@/components/common';
import { useMembershipStore } from '@/stores/mypageStore/';
import useSWR from 'swr';
import { getTransactionHistory } from '@/apis/mypageAPI';

export default function TransferHistory() {
  const selectedCrewAccount = useMembershipStore((state) => state.selectedCrewAccount);
  const selectedMyAccount = useMembershipStore((state) => state.selectedMyAccount);
  const fetcher = (crewAccountId, myAccountId) => getTransactionHistory(crewAccountId, myAccountId);

  const {
    data: transactionData,
    error,
    isLoading,
  } = useSWR(
    selectedCrewAccount && selectedMyAccount ? [selectedCrewAccount.accountId, selectedMyAccount.accountId] : null,
    ([crewAccountId, myAccountId]) => fetcher(crewAccountId, myAccountId),
    {
      fallbackData: [],
    },
  );

  return (
    <Flex direction="column" gap="20px">
      <Title>이체내역</Title>
      <div className={styles.transfer_list}>
        {isLoading && <p>로딩 중...</p>}
        {!isLoading && transactionData && transactionData.length > 0 ? (
          <ul>
            {transactionData.map((transaction, index) => (
              <li key={`${transaction.id}-${index}`}>
                <Flex direction="column" gap="10px">
                  <div className={styles.top}>
                    <Text as="span" size="1" className="gray_t2">
                      {transaction.trxTime}
                    </Text>
                    <Text as="p" size="2" weight="bold">
                      {transaction.agitName}
                    </Text>
                  </div>
                  <Flex justify="between" align="end" className={styles.btm}>
                    <div className={styles.account_info}>
                      <Text as="p" size="2" weight="medium">
                        {selectedCrewAccount.productName}
                      </Text>
                      <Text as="span" size="2" className="gray_t2">
                        {transaction.accountNumber}
                      </Text>
                    </div>
                    <Flex justify="end" align="center" gap="3px" asChild>
                      <Text as="p" size="2" weight="medium" className={styles.withdraw}>
                        <span>출금</span>
                        <em className="red">{transaction.amount.toLocaleString()}</em>
                        <span>원</span>
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </li>
            ))}
          </ul>
        ) : (
          !isLoading && !error && <p>이체 내역이 없습니다.</p>
        )}
      </div>
    </Flex>
  );
}
