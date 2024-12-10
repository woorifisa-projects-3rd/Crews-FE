import { getMyAgit } from '@/apis/mypageAPI';
import { Header, ImageCard, Title } from '@/components/common';
import { Box, Flex, Text } from '@radix-ui/themes';
import Image from 'next/image';

export default async function Agits() {
  const myAgits = await getMyAgit();
  if (myAgits?.errorCode) {
    throw new Error(myAgits.message);
  }

  return (
    <div className="page">
      <Header>아지트</Header>
      <div className="content">
        {myAgits == undefined || myAgits == null || myAgits.length <= 0 ? (
          <section className="height_full">
            <Flex direction="column" gap="20px">
              <Box className="img" align="center">
                <Image src="/imgs/img_empty.png" width={130} height={130} alt="가입한 아지트 없음" />
              </Box>
              <Box className="txt_box" align="center">
                <Title>크루 모집중</Title>
                <Box mt="15px">
                  <Text as="p" size="2" weight="medium" className="gray_t2">
                    앗! 가입한 모임이 없어요. <i className="dpb"></i>
                    마음에 드는 모임에 가입해보세요!
                  </Text>
                </Box>
              </Box>
            </Flex>
          </section>
        ) : (
          <section>
            <Flex direction="column" gap="10px" asChild>
              <ul>
                {myAgits.map((agit, i) => {
                  return (
                    <li key={`agit${i}`}>
                      <ImageCard data={agit} />
                    </li>
                  );
                })}
              </ul>
            </Flex>
          </section>
        )}
      </div>
    </div>
  );
}
