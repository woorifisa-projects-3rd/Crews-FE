'use client';

import { Box, Flex, Text } from '@radix-ui/themes';
import styles from './AccountDetail.module.css';
import { dateTime } from '@/utils/date';

export default function AccountDetail({ data }) {
  return (
    <li className={styles.account}>
      <Box className={styles.top}>
        <Text as="p" size="1" weight="medium">
          {dateTime(data.transactionTime)}
        </Text>
        <em>{data.description}</em>
      </Box>
      <Box className={styles.btm} align="right">
        <Flex justify="end" align="center" gap="3px" asChild>
          <Text as="p" size="2" weight="medium" className={styles.withdrawerName}>
            <span>
              {data.withdrawerName} {data.tranType === 'DEPOSIT' ? '입금' : '출금'}
            </span>
            <em className={`${data.tranType === 'DEPOSIT' ? styles.blue : styles.red}`}>
              {data.tranAmount.toLocaleString('ko-KR')}
            </em>
            <span>원</span>
          </Text>
        </Flex>
        <Box className={styles.afterBalanceAmount}>
          <Text as="p" size="1" weight="medium">
            잔액 {data.afterBalanceAmount.toLocaleString('ko-KR')} 원
          </Text>
        </Box>
      </Box>
    </li>
  );
}
