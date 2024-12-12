import { Header } from '@/components/common';
import { Box, Flex, Text } from '@radix-ui/themes';
import styles from './page.module.css';
import { getFeed } from '@/apis/agitsAPI';
import ReportHeartButton from '@/components/agits/ReportHeartButton';
import EditDeleteButton from '@/components/agits/EditDeleteButton';
import Image from 'next/image';
import { CDN_URL } from '@/constants/auth';

export default async function Page({ params }) {
  const feed = await getFeed(params.agitId, params.feedId);
  if (feed?.errorCode) {
    throw new Error(feed.message);
  }

  return (
    <div className="page">
      <Header side="center">활동 기록</Header>
      <Flex direction="column" gap="10px">
        <Box className="content">
          <section>
            <Flex direction="column" gap="20px">
              <Box className="img_box">
                <div
                  style={{
                    backgroundImage: `url(${feed?.image == null || feed?.image == '' ? '/imgs/img_bg_feed.jpg' : CDN_URL + feed?.image})`,
                  }}
                >
                  <Image src="/imgs/img_bg_feed.jpg" width={390} height={147} alt={`${feed.content} 이미지`} />
                </div>
              </Box>
              <Flex direction="column" gap="10px">
                <Flex justify="between" align="center" wrap="wrap" className={styles.info}>
                  <em>{new Date(feed.createdAt).toLocaleString()}</em>
                  <b className="gray_t1">{feed.name}</b>
                </Flex>
                <Text as="p" size="1" weight="medium" className="gray_t1">
                  {feed.content}
                </Text>
                <ReportHeartButton heart={feed.likeCount} agitId={params.agitId} feedId={params.feedId} />
              </Flex>
              <EditDeleteButton agitId={params.agitId} feedId={params.feedId} />
            </Flex>
          </section>
        </Box>
      </Flex>
    </div>
  );
}
