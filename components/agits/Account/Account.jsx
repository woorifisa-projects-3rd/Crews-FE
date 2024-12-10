'use client';

import { Box, Card, Flex, Text } from '@radix-ui/themes';
import styles from './Account.module.css';
import Image from 'next/image';
import { useState } from 'react';
import { BASE_URL, CDN_URL } from '@/constants/auth';

export default function Account({ data, hide = false }) {
  const [click, setClick] = useState(false);
  return (
    <div className={styles.account}>
      <Card>
        <Flex gap="10px">
          <div className={styles.img_box}>
            <div
              className={`${styles.img} back_img ${data.bankImage == null ? styles.blank : ''}`}
              style={{
                backgroundImage: `url(${data.bankImage == null || data.bankImage == '' ? '/imgs/img_bg_bank.jpg' : CDN_URL + data.bankImage})`,
              }}
            >
              <Image src="/imgs/img_bg_bank.jpg" width={30} height={30} alt={`${data.bankName} 이미지`} />
            </div>
          </div>

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
              {hide ? (
                <button
                  className={`deep ${styles.btn_hide}`}
                  onClick={() => {
                    setClick(!click);
                  }}
                >
                  {click ? '보기' : '숨김'}
                </button>
              ) : (
                ''
              )}
            </Flex>
          </Box>
        </Flex>
      </Card>
    </div>
  );
}
