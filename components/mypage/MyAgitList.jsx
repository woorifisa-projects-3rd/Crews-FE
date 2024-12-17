'use client';

import { Box, Flex, Text } from '@radix-ui/themes';
import { ImageCard } from '@/components/common';

export default function MyAgitList({ data }) {
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
        <Flex direction="column" gap="10px" asChild>
          <ul>
            {data.map((agit, i) => {
              return (
                <li key={`agit${i}`}>
                  <ImageCard data={agit} />
                </li>
              );
            })}
          </ul>
        </Flex>
      )}
    </>
  );
}
