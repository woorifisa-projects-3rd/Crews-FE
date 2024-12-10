import { Header } from '@/components/common';
import { Box, Flex, Text } from '@radix-ui/themes';
import styles from './page.module.css';
import { getFeed } from '@/apis/agitsAPI';
import ReportHeartButton from '@/components/agits/ReportHeartButton';
import EditDeleteButton from '@/components/agits/EditDeleteButton';
import Image from 'next/image';

export default async function Page({ params }) {
  const feed = await getFeed(params.agitId, params.feedId);
  if (feed?.errorCode) {
    throw new Error(feed.message);
  }
  console.log('user: ', feed.image);

  return (
    <div className="page">
      <Header side="center">활동 기록</Header>
      <Flex direction="column" gap="10px">
        <Box className="content">
          <section>
            <Flex direction="column" gap="20px">
              <Box className="img_box">
                <Image
                  src={`https://djogyo1sj025q.cloudfront.net/${feed.image}` || '/imgs/img_bg_feed.jpg'}
                  width={190}
                  height={147}
                  alt={`${feed.content} 이미지`}
                />
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
