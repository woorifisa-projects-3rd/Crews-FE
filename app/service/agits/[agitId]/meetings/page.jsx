import { Title, ButtonS } from '@/components/common';
import { Flex } from '@radix-ui/themes';
import AgitHeader from '@/components/agits/AgitHeader';
import MeetingCard from '@/components/agits/Meeting/MeetingCard';

export default function Page({ params }) {
  return (
    <div className="page">
      <AgitHeader currentId={params.agitId} />
      <Flex direction="column" gap="10px" className="content">
        <section>
          <Flex direction="column" gap="20px">
            <Flex justify="between">
              <Title>정기 모임</Title>
              <ButtonS style="deep" as="link" href={`/service/agits/${params.agitId}/meetings/create`}>
                등록하기
              </ButtonS>
            </Flex>
            <MeetingCard agitId={params.agitId} />
          </Flex>
        </section>
      </Flex>
    </div>
  );
}
