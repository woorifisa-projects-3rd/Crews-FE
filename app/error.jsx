'use client';

import { ButtonL } from '@/components/common';
import { Box, Flex, Strong, Text } from '@radix-ui/themes';
import Image from 'next/image';

export default function Error({ error, reset }) {
  return (
    <Box className="error_page" p="3">
      <Flex justify="center" align="center" gap="20px">
        <Box className="img_box">
          <Box className="img">
            <Image src="/imgs/img_error.png" width={807} height={518} alt="에러 이미지" />
          </Box>
        </Box>
        <Box className="txt_box">
          <Box className="txt">
            <Strong>ERROR</Strong>
            <Text as="p">{error.message}</Text>
          </Box>
          <Box className="button" mt="5">
            <ButtonL style="deep" onClick={() => reset()}>
              다시 시도해보세요!
            </ButtonL>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
