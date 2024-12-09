import { ButtonL, ImageCard, Title } from '@/components/common';
import { Box, Flex } from '@radix-ui/themes';
import styles from './page.module.css';
import Image from 'next/image';
import { cardIssuance, getAccount, getDues, getFeeds, getMeeting } from '@/apis/agitsAPI';
import Link from 'next/link';
import AccountAndHeader from '@/components/agits/Account/AccountAndHeader';
import { date } from '@/utils/date';

export default async function Page({ params }) {
  const yearAndMonth = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  };
  const dues = await getDues(params.agitId, yearAndMonth);
  if (dues?.errorCode) {
    throw new Error(dues.message);
  }
  const data = await getAccount(params.agitId);
  if (data?.errorCode) {
    throw new Error(data.message);
  }
  const events = await getMeeting(params.agitId, 0, 3);
  if (events?.errorCode) {
    throw new Error(events.message);
  }

  const isCard = await cardIssuance(params.agitId);
  if (isCard?.errorCode) {
    throw new Error(isCard.message);
  }

  const eventsInfo = events.data.map((event) => ({
    id: event.id,
    introduction: event.content,
    place: event.place.split(' ')[event.place.split(' ').length - 1],
    image: event.image,
    name: event.name,
    date: date(event.date),
  }));

  const feedsInfo = await getFeeds(params.agitId, 0);
  if (feedsInfo?.errorCode) {
    throw new Error(feedsInfo.message);
  }
  const feeds = feedsInfo.data.map((feed) => ({
    id: feed.id,
    title: feed.content,
    image: feed.image,
  }));

  return (
    <div className="page">
      <AccountAndHeader agitId={params.agitId} dues={dues} data={data} isCard={isCard}></AccountAndHeader>
      <Flex direction="column" gap="10px" className="content">
        <section>
          <Flex direction="column" gap="20px">
            <Title>최근정모</Title>
            <Flex direction="column" gap="20px">
              <Box>
                <Flex direction="column" gap="10px">
                  {eventsInfo.map((event, i) => {
                    return <ImageCard type="event" data={event} key={`event${i}`}></ImageCard>;
                  })}
                </Flex>
              </Box>
            </Flex>
            <ButtonL style="deep" as="link" href={`/service/agits/${params.agitId}/meetings`}>
              정기모임 보러가기
            </ButtonL>
          </Flex>
        </section>
        <section>
          <Flex direction="column" gap="20px">
            <Title>최근기록</Title>
            <Box className={styles.feed_list}>
              <Flex gap="10px" wrap="wrap" asChild>
                <ul>
                  {feeds.map((feed, i) => (
                    <li
                      className="back_img"
                      style={{
                        backgroundImage: `url(${feed?.image == null || feed?.image == '' ? '/imgs/img_bg_feed.jpg' : feed?.image})`,
                      }}
                      key={`feed${i}`}
                    >
                      <Link href={`/service/agits/${params.agitId}/feeds/${feed?.id}`}>
                        <Image src={'/imgs/img_bg_feed.jpg'} width={190} height={190} alt={`${feed?.title} 이미지`} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Flex>
            </Box>
            <ButtonL style="deep" as="link" href={`/service/agits/${params.agitId}/feeds`}>
              활동기록 보러가기
            </ButtonL>
          </Flex>
        </section>
      </Flex>
    </div>
  );
}
