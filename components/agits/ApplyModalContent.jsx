'use client';

import { Label } from '@/components/common';
import styles from './ApplyModalContent.module.css';
import { Callout, Flex, Text } from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import useSWR from 'swr';
import { getAgitIntroducing, getAgitMeetings } from '@/apis/searchAPI';
import { BASE_URL } from '@/constants/auth';
import { getAddressValue } from '@/utils/address';

export default function ApplyModalContent({ agitId }) {
  const { data: introducingData } = useSWR(`${BASE_URL}agits/${agitId}/introducing`, async () => {
    const response = await getAgitIntroducing(agitId);
    return response;
  });

  const { data: meetingsData } = useSWR(`${BASE_URL}agits/${agitId}/meetings/recent`, async () => {
    const response = await getAgitMeetings(agitId);
    return response;
  });

  return (
    <Flex direction="column" gap="20px">
      <div className={styles.img_box}>
        <div className="img">
          {introducingData?.image == '' || introducingData?.image == null ? (
            <img src="/imgs/dev/img_apply.jpg" />
          ) : (
            <img src={introducingData.image} />
          )}
        </div>
        <Label style="lime">{introducingData?.subject}</Label>
      </div>
      <Flex direction="column" gap="20px" className={styles.txt_box}>
        <div className="info_list">
          <Flex direction="column" gap="10px" asChild>
            <ul>
              <li>
                <em>활동지역</em>
                <Text as="p" size="2" weight="medium" className="gray_t1">
                  {getAddressValue(introducingData?.address)}
                </Text>
              </li>
              <li>
                <em>한줄소개</em>
                <Text as="p" size="2" weight="medium" className="gray_t1">
                  {introducingData?.introduce}
                </Text>
              </li>
              <li>
                <em>모임특징</em>
                <Text as="p" size="2" weight="medium" className="gray_t1">
                  {introducingData?.content}
                </Text>
              </li>
            </ul>
          </Flex>
        </div>
        <div className={styles.interest_list}>
          <Flex wrap="wrap" gap="10px" asChild>
            <ul>
              {introducingData?.interests.map((interest) => {
                return (
                  <li key={`interest${interest?.id}`}>
                    <Label style="deep">{`#${interest?.name}`}</Label>
                  </li>
                );
              })}
            </ul>
          </Flex>
        </div>
        <Callout.Root color="green">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>
            최근 한달동안 정기모임이 <span className="underline">{meetingsData}번</span> 진행되었어요!
          </Callout.Text>
        </Callout.Root>
      </Flex>
    </Flex>
  );
}
