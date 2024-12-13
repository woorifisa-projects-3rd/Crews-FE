import { getMeetingForEdit } from '@/apis/agitsAPI';
import MeetingForm from '@/components/agits/MeetingForm';
import { Header } from '@/components/common';
import { Flex } from '@radix-ui/themes';

export default async function Page({ params }) {
  const initMeeting = await getMeetingForEdit(params.agitId, params.meetingId);
  if (initMeeting?.errorCode) {
    throw new Error(initMeeting.message);
  }

  return (
    <div className="page">
      <Header side="center">정기모임 수정</Header>
      <Flex direction="column" gap="20px" className="content">
        <section>
          <MeetingForm agitId={params.agitId} meetingId={params.meetingId} initMeeting={initMeeting} status="edit" />
        </section>
      </Flex>
    </div>
  );
}
