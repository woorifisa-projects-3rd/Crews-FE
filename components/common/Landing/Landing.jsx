import { Box, Flex, Heading, Text } from '@radix-ui/themes';
import styles from './Landing.module.css';
import Link from 'next/link';

export default function Landing() {
  return (
    <div className={styles.landing_box}>
      <Flex justify="between" direction="column" className={styles.inner}>
        <Box className={styles.title}>
          <Heading as="h2">
            소모임 통합 플랫폼, <i className="dpb"></i>
            크루즈
          </Heading>
          <Text as="p">BaaS 기반 임베디드 금융 서비스</Text>
        </Box>
        <Flex align="end" direction="column" gap="20px" className={styles.info_box}>
          <Box className={`${styles.name} gray_t1`} align="right">
            <em>클라우드 서비스 개발 6팀</em>
            <Flex justify="end" align="center" gap="15px" asChild>
              <ul>
                <li>강재연</li>
                <li>신원섭</li>
                <li>김창영</li>
                <li>이명렬</li>
                <li>이규한</li>
              </ul>
            </Flex>
          </Box>
          <Box className={styles.btn_github}>
            <Flex gap="10px" asChild>
              <ul>
                <li>
                  <Link href="https://github.com/woorifisa-projects-3rd/Crews-FE" target="_blank">
                    <span>FrontEnd</span>
                  </Link>
                </li>
                <li>
                  <Link href="https://github.com/woorifisa-projects-3rd/Crews-BE-Service" target="_blank">
                    <span>BackEnd Service</span>
                  </Link>
                </li>
                <li>
                  <Link href="https://github.com/woorifisa-projects-3rd/Crews-BE-Core" target="_blank">
                    <span>BackEnd Core</span>
                  </Link>
                </li>
              </ul>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </div>
  );
}
