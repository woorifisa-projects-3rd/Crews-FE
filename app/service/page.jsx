'use client';

import { TabMenu } from '@/components/common';
import { tabMenuList } from '@/constants/tabMenuList/service';
import { Flex, Heading } from '@radix-ui/themes';
import Image from 'next/image';
import styles from './page.module.css';
import Link from 'next/link';
import { Suspense } from 'react';
import ServiceMain from '@/components/ServiceMain';

export default function Service() {
  return (
    <Suspense>
      <div className="page">
        <header>
          <Flex justify="between" align="center" className={styles.header_top}>
            <Heading as="h1">CREWS</Heading>
            <Link href="/service/payment">
              <Image src="/icons/ico_payment.svg" width={18} height={18} alt="결제하기" />
            </Link>
          </Flex>
          <TabMenu as="button" tabMenuList={tabMenuList} />
        </header>
        <ServiceMain />
      </div>
    </Suspense>
  );
}
