'use client';

import { getReport } from '@/apis/adminAPI';
import { Flex, Text } from '@radix-ui/themes';
import Image from 'next/image';
import { useEffect } from 'react';
import useSWR from 'swr';

export default function ReportModalContent({ mutate, feedId }) {
  const { data } = useSWR(`admin/reported/feeds/${feedId}`, async () => await getReport(feedId));
  useEffect(() => {
    mutate();
  }, []);
  return (
    <Flex direction="column" gap="20px">
      <div className="img" style={{ position: 'relative' }}>
        {data?.feedImage != '' && data?.feedImage != null && (
          <Image
            src={data?.feedImage}
            alt="신고기록 이미지"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
          />
        )}
      </div>
      <div className="info_list">
        <Flex direction="column" gap="10px" asChild>
          <ul>
            <li>
              <em>활동기록</em>
              <Text as="p" size="2" weight="medium" className="gray_t1">
                {data?.feedContent}
              </Text>
            </li>
            <li>
              <em>등록일자</em>
              <Text as="p" size="2" weight="medium" className="gray_t1">
                {data?.createdAt ? new Date(data?.createdAt).toISOString().split('T')[0] : ''}
              </Text>
            </li>
            <li>
              <em>신고사유</em>
              <Text as="p" size="2" weight="medium" className="gray_t1">
                {data?.content}
              </Text>
            </li>
          </ul>
        </Flex>
      </div>
    </Flex>
  );
}
