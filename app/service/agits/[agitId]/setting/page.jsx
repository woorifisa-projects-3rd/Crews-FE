import { ButtonL, Title } from '@/components/common';
import { Flex, Text } from '@radix-ui/themes';
import ProfileCardList from '@/components/agits/ProfileCardList';
import AgitHeader from '@/components/agits/AgitHeader';
import { agitManage } from '@/apis/agitsAPI';

export default async function Page({ params }) {
  const manage = await agitManage(params.agitId);
  if (manage?.errorCode) {
    throw new Error(manage.message);
  }
  return (
    <div className="page">
      <AgitHeader currentId={params.agitId} />
      <Flex direction="column" gap="10px" className="content">
        <section>
          <Flex direction="column" gap="20px">
            {/* 통장 권한 신청 제목 */}
            <Flex justify="between" align="center" wrap="wrap">
              <Title>통장 권한 신청</Title>
              <Text as="p" size="2" weight="medium" className="gray_t1">
                {manage.advancedMember}명
              </Text>
            </Flex>

            {/* ProfileCardList 렌더링 */}
            <ProfileCardList agitId={params.agitId} status="account" members={manage.advancedMembers} />

            {/* 조건문 렌더링 */}
            {manage.advancedMember == 0 ? (
              <Flex justify="center" align="center" style={{ width: '100%' }}>
                <Text as="p" weight="medium">
                  <span>통장 권한 요청한 멤버가 없습니다.</span>
                </Text>
              </Flex>
            ) : (
              <Flex direction="column" gap="10px">
                <ButtonL as="link" href={`/service/agits/${params.agitId}/setting/details`} style="deep" size="3">
                  더보기
                </ButtonL>
              </Flex>
            )}
          </Flex>
        </section>
        <section>
          <Flex direction="column" gap="20px">
            <Flex justify="between" align="center" wrap="wrap">
              <Title>가입신청</Title>
              <Text as="p" size="2" weight="medium" className="gray_t1">
                {manage.requestedMember}명
              </Text>
            </Flex>
            <ProfileCardList agitId={params.agitId} status="member" members={manage.requestedMembers} />
            {manage.requestedMember == 0 ? (
              <Text
                as="p"
                weight="medium"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
              >
                <span>가입신청을 요청한 멤버가 없습니다.</span>
              </Text>
            ) : (
              <Flex direction="column" gap="10px">
                <ButtonL as="link" href={`/service/agits/${params.agitId}/setting/details`} style="deep" size="3">
                  더보기
                </ButtonL>
                {/* <Text align="center" size="2" className="gray_t2">
              아지트 해체
            </Text> */}
              </Flex>
            )}
          </Flex>
        </section>
      </Flex>
    </div>
  );
}
