import { ButtonL, Title } from '@/components/common';
import { Flex, Text } from '@radix-ui/themes';
import ProfileCardList from '@/components/agits/Manage/ProfileCardList';
import AgitHeader from '@/components/agits/AgitHeader';
import { agitManage } from '@/apis/agitsAPI';
import styles from './page.module.css';

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
            <Flex justify="between" align="center" wrap="wrap">
              <Title>멤버</Title>
              <Text as="p" size="2" weight="medium" className="gray_t1">
                {manage.currentMember}명
              </Text>
            </Flex>
            <ProfileCardList agitId={params.agitId} status="account" members={manage.members} />
            {manage.currentMember == 0 ? (
              <Text as="p" weight="medium" className={styles.center}>
                <span>모임원이 없습니다.</span>
              </Text>
            ) : (
              <ButtonL as="link" href={`/service/agits/${params.agitId}/manage/details`} style="deep" size="3">
                더보기
              </ButtonL>
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
              <Text as="p" weight="medium" className={styles.center}>
                <span>가입신청을 요청한 멤버가 없습니다.</span>
              </Text>
            ) : (
              <ButtonL as="link" href={`/service/agits/${params.agitId}/manage/details`} style="deep" size="3">
                더보기
              </ButtonL>
            )}
          </Flex>
        </section>
      </Flex>
    </div>
  );
}
