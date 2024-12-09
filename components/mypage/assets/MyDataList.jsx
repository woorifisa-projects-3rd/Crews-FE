'use client';
import Image from 'next/image';
import { Flex, Box, Text } from '@radix-ui/themes';
import styles from './MyDataList.module.css';
import { ButtonL } from '@/components/common';

export default function MyDataList({ data, selectedAssets, onSelect, onConnect }) {
  if (!data || data.length === 0) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '200px' }}>
        연결 가능한 자산이 없습니다.
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="10px">
      <ul className={styles.assetList}>
        <Flex direction="column" gap="10px">
          {data.map((asset) => (
            <li key={`asset-${asset.accountNumber}`} className={styles.assetItem}>
              <Flex align="center" justify="between">
                <Flex align="center" gap="10px">
                  <Box className={styles.imgBox}>
                    <Box
                      className={`${styles.profileImg} back_img`}
                      style={{ backgroundImage: `url(${asset.bankImage})` }}
                    >
                      <Image
                        src={asset.bankImage}
                        width={36}
                        height={36}
                        alt={`${asset.productName} 이미지`}
                        className={styles.image}
                      />
                    </Box>
                  </Box>
                  <Flex direction="column" gap="0px">
                    <Text as="p" weight="bold">
                      {asset.productName}
                    </Text>
                    <Text as="p" size="2" className="gray_t2">
                      {asset.accountNumber}
                    </Text>
                  </Flex>
                </Flex>
                <Flex align="center" gap="10px">
                  <input
                    type="checkbox"
                    id={`asset-${asset.accountNumber}`}
                    checked={selectedAssets.includes(asset.accountNumber)}
                    onChange={() => onSelect(asset.accountNumber)}
                    className={styles.checkboxInput}
                  />
                  <label htmlFor={`asset-${asset.accountNumber}`} className={`blue_bg ${styles.selectButton}`}>
                    {selectedAssets.includes(asset.accountNumber) ? '선택해제' : '선택하기'}
                  </label>
                </Flex>
              </Flex>
            </li>
          ))}
        </Flex>
      </ul>
      <ButtonL style="deep" onClick={onConnect}>
        선택한 자산 연결하기
      </ButtonL>
    </Flex>
  );
}
