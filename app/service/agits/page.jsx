import { Header, Title } from '@/components/common';
import { Box, Flex, Text } from '@radix-ui/themes';
import Image from 'next/image';

export default async function Agits() {
  const allAgits = await getAllAgits();
  if (allAgits?.errorCode) {
    throw new Error(allAgits.message);
  }
  return (
    <div className="page">
      <Header>아지트</Header>
      <div className="content">
        <section className="height_full">
          <Flex direction="column" gap="20px">
            <Box className="img" align="center">
              <Image src="/imgs/img_empty.png" width={130} height={130} alt="가입한 아지트 없음" />
            </Box>
            <Box className="txt_box" align="center">
              <Title>어쩌고저쩌고</Title>
              <Box mt="15px">
                <Text as="p" size="2" weight="medium" className="gray_t2">
                  앗! 가입한 모임이 없어요. <i className="dpb"></i>
                  마음에 드는 모임에 가입해보세요!
                </Text>
              </Box>
            </Box>
          </Flex>
        </section>
      </div>
    </div>
  );
}
