import { NavigationAdmin, Title } from '@/components/common';
import { Container, Flex, Text } from '@radix-ui/themes';

export default function Layout({ children }) {
  return (
    <div className="admin">
      <NavigationAdmin />
      <Container size="3" className="container">
        <div className="page">
          <div className="content">
            <section>
              <Flex direction="column" gap="20px">
                <Flex direction="column" gap="5px" className="txt_box">
                  <Title>사용자 관리</Title>
                  <div className="txt_con">
                    <Text as="p" size="2" weight="medium">
                      사용자가 신고한 활동기록 조회
                    </Text>
                  </div>
                </Flex>
                {children}
              </Flex>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
