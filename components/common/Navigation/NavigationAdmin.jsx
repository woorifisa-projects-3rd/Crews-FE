'use client';

import styles from './NavigationAdmin.module.css';
import { Container, Flex } from '@radix-ui/themes';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function NavigationAdmin() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session?.role == 'ROLE_USER') {
    alert('접근할 수 없는 페이지 입니다!');
    router.push('/service');
  }

  return (
    <div className={styles.navigation}>
      <Container size="3" asChild>
        <header>
          <Flex justify="between" align="center" px="3" className={styles.title}>
            <h1>크루즈 관리자 페이지</h1>
            <button
              onClick={async () => {
                await signOut();
                alert('로그아웃 되었습니다!');
              }}
            >
              로그아웃
            </button>
          </Flex>
        </header>
      </Container>
    </div>
  );
}
