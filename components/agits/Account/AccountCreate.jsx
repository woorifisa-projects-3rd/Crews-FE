'use client';

import styles from './AccountCreate.module.css';
import { Box, Card, Flex, Text } from '@radix-ui/themes';
import Image from 'next/image';
import { ButtonS } from '@/components/common';

export default function DepositProduct({ product }) {
  return (
    <li>
      <Card>
        <Flex gap="10px" direction="row">
          <Box className={styles.img_box}>
            <div className={`${styles.img} img`}>
              <Image src="/imgs/dev/img_bank.jpg" width={30} height={30} alt={`${product.bank} 이미지`} />
            </div>
          </Box>
          <Flex direction="column" gap="10px" className={styles.txt_box}>
            <Box className={styles.top}>
              <em>{product.name}</em>
              <Text as="p" size="1" weight="medium">
                {product.bank}
              </Text>
            </Box>
            <Box className={styles.rate}>
              <Flex gap="10px" asChild>
                <ul>
                  <li>
                    <Text as="p" size="1" weight="bold">
                      최고
                    </Text>
                    <Text as="label" size="3" weight="bold" className="light">
                      {product.highestRate}
                    </Text>
                  </li>
                  <li>
                    <Text as="p" size="1" weight="bold">
                      최저
                    </Text>
                    <Text as="label" size="3" weight="bold" className="light">
                      {product.lowestRate}
                    </Text>
                  </li>
                </ul>
              </Flex>
            </Box>
          </Flex>
        </Flex>
        <Flex justify="end" gap="10px" pt="3">
          <ButtonS as="link" href="/" style="light">
            상세정보
          </ButtonS>
          <ButtonS style="deep">상품선택</ButtonS>
        </Flex>
      </Card>
    </li>
  );
}
