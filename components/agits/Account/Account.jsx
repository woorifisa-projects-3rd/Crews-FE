'use client';

import { Box, Card, Flex, Text } from '@radix-ui/themes';
import styles from './Account.module.css';
import Image from 'next/image';
import { useState } from 'react';

export default function Account({ data }) {
  const [click, setClick] = useState(false);

  return (
    <div className={styles.account}>
      <Card>
        <Flex gap="10px">
          <Box className={styles.img_box}>
            <div className={`${styles.img} img`}>
              <Image src="/imgs/dev/img_bank.jpg" width={30} height={30} alt={`${data.bankName} 이미지`} />
            </div>
          </Box>
          <Box className={styles.account_info}>
            <Box className={styles.top}>
              <em>{data.productName}</em>
              <Text as="p" size="1" weight="medium">
                {data.accountNumber}
              </Text>
            </Box>
            <Flex align="center" gap="10px" mt="2" className={styles.btm}>
              {click ? (
                <Text as="p" weight="medium" className={styles.balance}>
                  잔액숨김
                </Text>
              ) : (
                <Text as="p" weight="medium" className={styles.balance}>
                  <em>{data.balance.toLocaleString('ko-KR')}</em> 원
                </Text>
              )}
              <button
                className={`deep ${styles.btn_hide}`}
                onClick={() => {
                  setClick(!click);
                }}
              >
                {click ? '보기' : '숨김'}
              </button>
            </Flex>
          </Box>
        </Flex>
      </Card>
    </div>
  );
}
