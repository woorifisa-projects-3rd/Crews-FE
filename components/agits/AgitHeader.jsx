'use client';

import { Label, SelectFilter, TabMenu } from '@/components/common';
import { useEffect, useState } from 'react';
import { tabMenuList } from '@/constants/tabMenuList/agits';
import { useAgitInfoStore } from '@/stores/authStore';
import { Flex, Skeleton } from '@radix-ui/themes';
import styles from './AgitHeader.module.css';
import { useCallAgitInfo } from '@/hooks';
import Image from 'next/image';

export default function AgitHeader({ currentId }) {
  const { agitInfoList } = useAgitInfoStore();
  const [agit, setAgit] = useState(null);

  useCallAgitInfo();

  useEffect(() => {
    if (agitInfoList?.length > 0) {
      const [filtered] = agitInfoList.filter((select) => select.id == currentId);
      setAgit(filtered);
    }
  }, [agitInfoList, currentId]);
  return (
    <header>
      <Flex justify="between" align="center" gap="10px" className={styles.agit_filter}>
        {agit ? (
          <>
            <SelectFilter isHeader={true} as="link" pathname="/service/agits" selectList={agitInfoList}>
              {agit?.text}
            </SelectFilter>
            {agit.memberRole == 'LEADER' && (
              <Label style="deep">
                <Flex align="center" gap="5px">
                  <span>모임장</span>
                  <Image src="/icons/ico_leader.svg" width={16} height={14} alt="모임장" />
                </Flex>
              </Label>
            )}
          </>
        ) : (
          <Skeleton className={styles.skeleton} />
        )}
      </Flex>
      <TabMenu tabMenuList={tabMenuList} baseUrl={`/service/agits/${agit?.id}`} />
    </header>
  );
}
