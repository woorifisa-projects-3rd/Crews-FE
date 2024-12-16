import { Label, Title, ButtonL } from '@/components/common';
import { Box, Flex, Text } from '@radix-ui/themes';
import AgitHeader from '@/components/agits/AgitHeader';
import { getIntroducing } from '@/apis/agitsAPI';
import Image from 'next/image';
import { getAddressValue } from '@/utils/address';
import { CDN_URL } from '@/constants/auth';

export default async function Page({ params }) {
  const introducing = await getIntroducing(params.agitId);
  if (introducing?.errorCode) {
    throw new Error(introducing.message);
  }

  return (
    <div className="page">
      <AgitHeader currentId={params.agitId} />
      <Box className="content">
        <section>
          <Flex direction="column" gap="20px">
            <Box className="title_btn">
              <Title>{introducing.agitName}</Title>
              <div className="right_top">
                <Label style="lime">{introducing.subject}</Label>
              </div>
            </Box>
            <Flex direction="column" gap="20px">
              <Box className="img_box">
                <div
                  className="img"
                  style={{
                    backgroundImage: `url(${introducing?.image == null || introducing?.image == '' ? '/dev/img_introduce.jpg' : CDN_URL + introducing?.image})`,
                  }}
                >
                  <Image src="/dev/img_introduce.jpg" width={390} height={250} alt={introducing.agitName} />
                </div>
              </Box>
              <Flex direction="column" gap="20px">
                <Box className="info_list">
                  <Flex direction="column" gap="10px" asChild>
                    <ul>
                      <li>
                        <em>활동 지역</em>
                        <Text as="p" size="2" weight="medium" className="gray_t1">
                          {getAddressValue(introducing.address)}
                        </Text>
                      </li>
                      <li>
                        <em>한줄 소개</em>
                        <Text as="p" size="2" weight="medium" className="gray_t1">
                          {introducing.introduce}
                        </Text>
                      </li>
                      <li>
                        <em>모임 특징</em>
                        <Text as="p" size="2" weight="medium" className="gray_t1">
                          {introducing.content}
                        </Text>
                      </li>
                    </ul>
                  </Flex>
                </Box>
                <Flex wrap="wrap" gap="10px" asChild>
                  <ul>
                    {introducing.interests.map((interest, index) => (
                      <li key={index}>
                        <Label style="deep">#{interest.name}</Label>
                      </li>
                    ))}
                  </ul>
                </Flex>
                <ButtonL style="deep" as="link" href={`/service/agits/${params.agitId}/introduce/edit`}>
                  수정하기
                </ButtonL>
              </Flex>
            </Flex>
          </Flex>
        </section>
      </Box>
    </div>
  );
}
