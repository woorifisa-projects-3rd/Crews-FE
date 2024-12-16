'use client';
import { getAllMeetings } from '@/apis/agitsAPI';
import { Flex, Text } from '@radix-ui/themes';
import { ImageCard, ImageCardSkeleton } from '../../common';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroll-component';
import useSWR from 'swr';

export default function MeetingCard({ agitId }) {
  const [allMeetings, setAllMeetings] = useState([]);
  const [page, setPage] = useState(0);
  const router = useRouter();

  const handleCardClick = (meetingId) => {
    if (agitId) {
      router.push(`/agits/${agitId}/meetings/${meetingId}`);
    } else {
      console.error('agitId is undefined');
    }
  };
  const {
    data: allMeetingData,
    isLoading,
    mutate,
  } = useSWR(`agits/${agitId}/meetings?page=${page}`, async () => await getAllMeetings(agitId, page));
  const fetchData = async () => {
    if (isLoading) return;
    if (page == 0) setAllMeetings([...allMeetingData.data]);
    else setAllMeetings((prev) => [...prev, ...allMeetingData.data]);
  };
  const loadMore = () => {
    if (allMeetingData?.hasNext && !isLoading) {
      setPage((prev) => prev + 1);
      mutate();
      fetchData();
    }
  };
  useEffect(() => {
    if (!isLoading) fetchData();
  }, [isLoading]);

  return (
    <InfiniteScroll
      dataLength={allMeetings?.length}
      hasMore={allMeetingData?.hasNext}
      next={loadMore}
      loader={<ImageCardSkeleton />}
    >
      <Flex direction="column" gap="10px">
        {isLoading && (
          <li style={{ width: '100%' }}>
            <ImageCardSkeleton />
          </li>
        )}
        {allMeetings == undefined || allMeetings.length == 0 ? (
          <Text as="p" weight="medium">
            정기 모임이 존재하지 않습니다!
          </Text>
        ) : (
          allMeetings.map((allMeeting, i) => {
            return (
              <ImageCard
                type="meeting"
                dynamicId={agitId}
                data={allMeeting}
                key={`meeting${i}`}
                onClick={() => handleCardClick(allMeeting.id)}
              ></ImageCard>
            );
          })
        )}
      </Flex>
    </InfiniteScroll>
  );
}
