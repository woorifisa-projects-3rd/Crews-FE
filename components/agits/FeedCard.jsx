import { getFeed } from '@/apis/agitsAPI';
import { Box, Flex, Text } from '@radix-ui/themes';
import styles from './FeedCard.module.css';
import Image from 'next/image';

export default async function FeedCard({ params }) {
  const feed = await getFeed(params.agitId, params.feedId);
  if (feed?.errorCode) {
    throw new Error(feed.message);
  }

  return (
    <Box className="content">
      <section>
        <Flex direction="column" gap="20px">
          <Box className="img_box">
            <div className="img">
              <Image
                src={`https://djogyo1sj025q.cloudfront.net/${feed.image}` || '/imgs/img_bg_feed.jpg'}
                alt={feed.name}
              />
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
          </Flex>
        </Flex>
      </section>
    </Box>
  );
}
