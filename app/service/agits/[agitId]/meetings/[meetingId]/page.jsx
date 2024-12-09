import { Title, ButtonL } from '@/components/common';
import { Box, Flex, Text } from '@radix-ui/themes';
import AgitHeader from '@/components/agits/AgitHeader';
import { getMeetingDetails } from '@/apis/agitsAPI';

export default async function Page({ params }) {
  console.log(params.agitId, params.meetingId);
  const meeting = await getMeetingDetails(params.agitId, params.meetingId);
  // ssr 에서만 하는 에러처리
  if (meeting?.errorCode) {
    throw new Error(meeting.message);
  }

  return (
    <div className="page">
      <AgitHeader currentId={params.agitId} />
      <Box className="content">
        <section>
          <Flex direction="column" gap="20px">
            <Title>{meeting.name}</Title>
            <ButtonL style="light" as="link" href={`/service/agits/${params.agitId}/meetings/${params.meetingId}/edit`}>
              수정하기
            </ButtonL>
            <Box className="img_box">
              <div className="img">
                <img src={meeting.image || '/dev/img_introduce.jpg'} alt={meeting.name} />
              </div>
            </Box>
            <Box className="info_list">
              <Flex direction="column" gap="10px" asChild>
                <ul>
                  <li>
                    <em>모임일시</em>
                    <Text as="p" size="2" weight="medium" className="gray_t1">
                      {new Date(meeting.date).toLocaleDateString()}{' '}
                      {new Date(meeting.date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </li>
                  <li>
                    <em>모임위치</em>
                    <Text as="p" size="2" weight="medium" className="gray_t1">
                      {meeting.place}
                    </Text>
                  </li>
                  <li>
                    <em>안내사항</em>
                    <Text as="p" size="2" weight="medium" className="gray_t1">
                      {meeting.content}
                    </Text>
                  </li>
                </ul>
              </Flex>
            </Box>
          </Flex>
        </section>
      </Box>
    </div>
  );
}
