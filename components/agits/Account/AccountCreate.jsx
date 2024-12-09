'use client';

import styles from './AccountCreate.module.css';
import { Box, Card, Flex, Text } from '@radix-ui/themes';
import Image from 'next/image';
import { ButtonL, Modal } from '@/components/common';
import { generateAccount } from '@/apis/agitsAPI';
import { useModal } from '@/hooks';
import { useState } from 'react';

export default function DepositProduct({ agitId, product }) {
  const { isOpen, openModal, closeModal } = useModal();
  const [account, setAccount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleGenerateAccount = async () => {
    setIsLoading(true);
    const response = await generateAccount(agitId, product.id);
    if (response?.errorCode) {
      alert('계좌 개설 중에 오류가 발생했습니다!');
      setIsLoading(false);
      return;
    }
    setAccount(response);
    setIsLoading(false);
    openModal();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        header={{
          title: (
            <>
              <span className="underline">{account?.productName}</span> <i className="dpb" />
              개설이 완료되었습니다!
            </>
          ),
        }}
        footer={
          <ButtonL as="link" href={`/service/agits/${agitId}`} style="deep">
            확인
          </ButtonL>
        }
      >
        <Box className={styles.account_info_list}>
          <em>계좌정보</em>
          <ul>
            <li>
              <b className="gray_t2">상품명</b>
              <Text as="p" size="2" className="gray_t1">
                {account?.productName}
              </Text>
            </li>
            <li>
              <b className="gray_t2">계좌번호</b>
              <Text as="p" size="2" className="gray_t1">
                {account?.accountNumber}
              </Text>
            </li>
            <li>
              <b className="gray_t2">명의자</b>
              <Text as="p" size="2" className="gray_t1">
                {account?.memberName}
              </Text>
            </li>
            <li>
              <b className="gray_t2">발급일</b>
              <Text as="p" size="2" className="gray_t1">
                {account?.createAt ? new Date(account?.createAt).toISOString().split('T')[0] : ''}
              </Text>
            </li>
          </ul>
        </Box>
      </Modal>
      <li>
        <Card>
          <Flex gap="10px" direction="row">
            <Box className={styles.img_box}>
              <div className={`${styles.img} img`}>
                <Image src={product.bankImage} width={30} height={30} alt={`${product.bankName} 이미지`} />
              </div>
            </Box>
            <Flex direction="column" gap="10px" className={styles.txt_box}>
              <Box className={styles.top}>
                <em>{product.productName}</em>
                <Text as="p" size="1" weight="medium">
                  {product.bankName}
                </Text>
              </Box>
              <Box className={styles.rate}>
                <Flex gap="10px" asChild>
                  <ul>
                    <li>
                      <Text as="p" size="1" weight="bold">
                        최고
                      </Text>
                      <Text as="label" size="3" weight="bold">
                        {`연 ${formatter.format(product.highestRate)}%`}
                      </Text>
                    </li>
                    <li>
                      <Text as="p" size="1" weight="bold">
                        최저
                      </Text>
                      <Text as="label" size="3" weight="bold">
                        {`연 ${formatter.format(product.lowestRate)}%`}
                      </Text>
                    </li>
                  </ul>
                </Flex>
              </Box>
            </Flex>
          </Flex>
          <Box pt="3">
            <ButtonL style="deep" onClick={handleGenerateAccount} disabled={isLoading}>
              {isLoading ? '개설중...' : '상품선택'}
            </ButtonL>
          </Box>
        </Card>
      </li>
    </>
  );
}
