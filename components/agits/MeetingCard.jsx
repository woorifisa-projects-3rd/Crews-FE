'use client';
import { getAllMeetings } from '@/apis/agitsAPI';
import { Flex } from '@radix-ui/themes';
import { ImageCard } from '../common';
import { date } from '@/utils/date';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MeetingCard({ agitId }) {
  const [meetings, setMeetings] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCardClick = (meetingId) => {
    if (agitId) {
      router.push(`/agits/${agitId}/meetings/${meetingId}`);
    } else {
      console.error('agitId is undefined');
    }
  };
  const fetchMeetings = async (currentPage) => {
    if (!hasNext || isLoading) return;
    setIsLoading(true);
    try {
      const response = await getAllMeetings(agitId, currentPage);
      const newMeetings = response.data.map((meeting) => ({
        id: meeting.id,
        name: meeting.name,
        image: meeting.image,
        introduction: meeting.content,
        place: meeting.place.split(' ')[meeting.place.split(' ').length - 1],
        date: date(meeting.date),
      }));

      // 중복 제거 로직
      setMeetings((prev) => {
        const existingIds = new Set(prev.map((meeting) => meeting.id));
        const uniqueMeetings = newMeetings.filter((meeting) => !existingIds.has(meeting.id));
        return [...prev, ...uniqueMeetings];
      });

      setHasNext(response.hasNext);
    } catch (error) {
      console.error('Failed to fetch meetings', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchMeetings(page);
  }, [page]);

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && hasNext) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNext]);

  console.log(meetings);
  return (
    <Flex direction="column" gap="10px">
      {meetings.map((meeting, i) => {
        return (
          <ImageCard
            type="meeting"
            dynamicId={agitId}
            data={meeting}
            key={`meeting${i}`}
            onClick={() => handleCardClick(meeting.id)}
          ></ImageCard>
        );
      })}
    </Flex>
  );
}
