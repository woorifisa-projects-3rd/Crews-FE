'use client';

import Image from 'next/image';

const { ImageCard, Title } = require('@/components/common');
const { Flex, Text, Box } = require('@radix-ui/themes');

export default function MyAgitList({ data }) {
  console.log(data);

  return (
    <>
      {data == undefined || data == null || data.length <= 0 ? (
        <Box className="txt_box">
          <Text as="p" size="2" weight="medium">
            앗! 가입한 모임이 없어요. <i className="dpb"></i>
            마음에 드는 모임에 가입해보세요!
          </Text>
        </Box>
      ) : (
        <Flex direction="column" gap="10px">
          {data.map((agit, i) => {
            return <ImageCard data={agit} key={`agit${i}`} />;
          })}
        </Flex>
      )}
    </>
  );
}
