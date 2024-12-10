'use client';

import { useNavStore } from '@/stores/layoutStore';
import Link from 'next/link';
import styles from './NavigationService.module.css';
import { Box, Flex } from '@radix-ui/themes';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function NavigationService() {
  const pathname = usePathname();
  const { navVisible } = useNavStore();
  const { data: session } = useSession();

  return (
    navVisible && (
      <Box px="3" className={styles.navigation}>
        <Flex asChild align="center" gap="50px">
          <nav>
            <ul>
              <li>
                <Link href="/service" className={pathname == '/service' ? `${styles.active}` : ''}>
                  <Box className={styles.svg} align="center">
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M0 12.7549C0 9.89436 7.45058e-08 8.4641 0.649 7.27843C1.298 6.09276 2.48369 5.35689 4.85504 3.88516L7.35504 2.33359C9.86174 0.777862 11.1151 0 12.5 0C13.8849 0 15.1382 0.777862 17.645 2.33359L20.145 3.88515C22.5164 5.35689 23.702 6.09276 24.351 7.27843C25 8.4641 25 9.89436 25 12.7549V14.6562C25 19.5323 25 21.9704 23.5355 23.4851C22.0711 25 19.714 25 15 25H10C5.28595 25 2.92894 25 1.46446 23.4851C1.49012e-07 21.9704 0 19.5323 0 14.6562V12.7549Z"
                        fill="#f0f0f0"
                      />
                      <path
                        d="M11.5625 20C11.5625 20.5178 11.9823 20.9375 12.5 20.9375C13.0178 20.9375 13.4375 20.5178 13.4375 20V16.25C13.4375 15.7323 13.0178 15.3125 12.5 15.3125C11.9823 15.3125 11.5625 15.7323 11.5625 16.25V20Z"
                        fill="#DDDDDD"
                        className={styles.lime}
                      />
                    </svg>
                  </Box>
                  <em>홈</em>
                </Link>
              </li>
              <li>
                <Link
                  href="/service/search"
                  className={pathname.startsWith('/service/search') ? `${styles.active}` : ''}
                >
                  <Box className={styles.svg} align="center">
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M11.4455 22.8917C17.7667 22.8917 22.8911 17.7672 22.8911 11.4458C22.8911 5.12447 17.7667 0 11.4455 0C5.12434 0 0 5.12447 0 11.4458C0 17.7672 5.12434 22.8917 11.4455 22.8917Z"
                        fill="#F0F0F0"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.4454 7.53076C11.9444 7.53076 12.3489 7.93532 12.3489 8.43439V10.5429H14.4574C14.9563 10.5429 15.361 10.9474 15.361 11.4464C15.361 11.9455 14.9563 12.35 14.4574 12.35H12.3489V14.4585C12.3489 14.9575 11.9444 15.3621 11.4454 15.3621C10.9463 15.3621 10.5418 14.9575 10.5418 14.4585V12.35H8.43338C7.93434 12.35 7.52979 11.9455 7.52979 11.4464C7.52979 10.9474 7.93434 10.5429 8.43338 10.5429H10.5418V8.43439C10.5418 7.93532 10.9463 7.53076 11.4454 7.53076Z"
                        fill="#DDDDDD"
                        className={styles.lime}
                      />
                      <path
                        d="M18.8748 20.1524L23.4575 24.7353C23.8104 25.0882 24.3825 25.0882 24.7354 24.7353C25.0882 24.3824 25.0882 23.8103 24.7354 23.4574L20.1526 18.8745C19.7609 19.3333 19.3335 19.7606 18.8748 20.1524Z"
                        fill="#DDDDDD"
                        className={styles.lime}
                      />
                    </svg>
                  </Box>
                  <em>검색</em>
                </Link>
              </li>
            </ul>
            <div className={styles.btn_payment}>
              <Link href="/service/agits/create">
                <em>아지트 생성</em>
              </Link>
            </div>
            <ul>
              <li>
                <Link href="/service/agits" className={pathname.startsWith('/service/agits') ? `${styles.active}` : ''}>
                  <Box className={styles.svg} align="center">
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.95348 3.62793H11.7907C14.0709 3.62793 15.2111 3.62793 15.9195 4.33633C16.6279 5.04471 16.6279 6.18485 16.6279 8.46514V23.2791H18.4418H23.8837H25.093C25.5939 23.2791 26 23.6852 26 24.1861C26 24.6869 25.5939 25.093 25.093 25.093H0.906976C0.406071 25.093 0 24.6869 0 24.1861C0 23.6852 0.406071 23.2791 0.906976 23.2791H2.11628V8.46514C2.11628 6.18485 2.11628 5.04471 2.82467 4.33633C3.53306 3.62793 4.6732 3.62793 6.95348 3.62793ZM4.83721 7.25583C4.83721 6.75493 5.24328 6.34886 5.74418 6.34886H13C13.5009 6.34886 13.907 6.75493 13.907 7.25583C13.907 7.75674 13.5009 8.16281 13 8.16281H5.74418C5.24328 8.16281 4.83721 7.75674 4.83721 7.25583ZM4.83721 10.8837C4.83721 10.3828 5.24328 9.97676 5.74418 9.97676H13C13.5009 9.97676 13.907 10.3828 13.907 10.8837C13.907 11.3846 13.5009 11.7907 13 11.7907H5.74418C5.24328 11.7907 4.83721 11.3846 4.83721 10.8837ZM4.83721 14.5116C4.83721 14.0108 5.24328 13.6047 5.74418 13.6047H13C13.5009 13.6047 13.907 14.0108 13.907 14.5116C13.907 15.0125 13.5009 15.4186 13 15.4186H5.74418C5.24328 15.4186 4.83721 15.0125 4.83721 14.5116ZM9.37209 19.6512C9.87299 19.6512 10.2791 20.0573 10.2791 20.5582V23.2791H8.46511V20.5582C8.46511 20.0573 8.87118 19.6512 9.37209 19.6512Z"
                        fill="#DDDDDD"
                        className={styles.lime}
                      />
                      <path
                        d="M16.6279 0H19.0466C21.3268 0 22.4669 -7.208e-08 23.1753 0.708397C23.8838 1.41678 23.8838 2.55692 23.8838 4.83721V23.2791H16.6279V8.46511C16.6279 6.18483 16.6279 5.04469 15.9195 4.3363C15.2271 3.64386 14.1222 3.62827 11.9431 3.62792V1.81394C12.0451 1.34565 12.2152 0.992341 12.4992 0.708397C13.2074 -7.208e-08 14.3477 0 16.6279 0Z"
                        fill="#F0F0F0"
                      />
                    </svg>
                  </Box>
                  <em>아지트</em>
                </Link>
              </li>
              <li>
                <Link
                  href={!session ? '/service/login' : '/service/mypage'}
                  className={
                    pathname.startsWith('/service/mypage') || pathname.startsWith('/service/login')
                      ? `${styles.active}`
                      : ''
                  }
                >
                  <Box className={styles.svg} align="center">
                    <svg width="20" height="25" viewBox="0 0 20 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M10 10C12.7614 10 15 7.76145 15 5.00002C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5.00002C5 7.76145 7.23858 10 10 10Z"
                        fill="#DDDDDD"
                        className={styles.lime}
                      />
                      <path
                        d="M20.0001 19.375C20.0001 22.4817 20.0001 25 10 25C0 25 0 22.4817 0 19.375C0 16.2684 4.47716 13.75 10 13.75C15.5229 13.75 20.0001 16.2684 20.0001 19.375Z"
                        fill="#F0F0F0"
                      />
                    </svg>
                  </Box>
                  <em>{!session ? '로그인' : '마이페이지'}</em>
                </Link>
              </li>
            </ul>
          </nav>
        </Flex>
      </Box>
    )
  );
}
