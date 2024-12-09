'use client';

import { ImageCard, Title, ButtonS } from '@/components/common';
import { agitsSelectMenuList } from '@/constants/selectMenuList/sample';
import { Box, Flex } from '@radix-ui/themes';
import AgitHeader from '@/components/agits/AgitHeader';
import { useState } from 'react';
import { getAllMeetings } from '@/apis/agitsAPI';

export default function Page({ params }) {
  const [agits] = agitsSelectMenuList.filter((select) => select.id == params.agitId);
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await getAllMeetings(params.agitId);
        setMeetings(response.data.meetings);
      } catch (error) {
        console.error('failed to fetch meetings', error);
      }
    };
    if (agits) {
      fetchMeetings();
    }
  }, [params.agitId, agits]);
  if (!agits) {
    return <div>Agit not found</div>;
  }
  return (
    <div className="page">
      <AgitHeader currentId={params.agitId} />
      <Flex direction="column" gap="10px" className="content">
        <section>
          <Flex direction="column" gap="20px">
            <Flex justify="between">
              <Title>정기 모임</Title>
              <ButtonS style="deep">등록하기</ButtonS>
            </Flex>
            <Box>
              <Flex direction="column" gap="10px">
                {meetings.map((meeting) => (
                  <ImageCard
                    key={meeting.id}
                    type="meeting"
                    date={{
                      id: meeting.id,
                      name: meeting.regularName,
                      image: meeting.image,
                      introduction: meeting.content,
                      place: meeting.place,
                      date: meeting.regularTime,
                    }}
                    dynamicId={agits.id}
                  />
                ))}
              </Flex>
            </Box>
          </Flex>
        </section>
      </Flex>
    </div>
  );
}
