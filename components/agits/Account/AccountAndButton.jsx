'use client';
import { useCallAgitInfo } from '@/hooks';
import { useAgitInfoStore } from '@/stores/authStore';
import { useEffect, useState } from 'react';
import { Flex } from '@radix-ui/themes';
import NoAccount from './NoAccount';
import Account from './Account';
import { ButtonL, ButtonM, Title } from '@/components/common';
import { sendPermission } from '@/apis/agitsAPI';
export default function AccountAndHeader({ agitId, data }) {
  const { agitInfoList } = useAgitInfoStore();
  const [agit, setAgit] = useState(null);
  useCallAgitInfo();
  useEffect(() => {
    if (agitInfoList?.length > 0) {
      const [filtered] = agitInfoList.filter((select) => select.id == agitId);
      setAgit(filtered);
    }
  }, [agitInfoList]);
  const handlePermission = async () => {
    const response = await sendPermission(agitId);
    if (response?.errorCode) {
      console.log(response.message);
      alert('에러가 발생했습니다. 다시 실행 해 주세요.');
    } else if (response) {
      alert('권한 요청이 되었습니다.');
    }
  };
  return (
    <section>
      <Flex direction="column" gap="20px">
        <Title>모임통장 상세</Title>
        {data.ci == null ? <NoAccount></NoAccount> : <Account data={data} />}
        {agit?.memberRole === 'LEADER' ? (
          <ButtonM
            leftButton={{ text: '회비 납부 관리', as: 'link', href: `/service/agits/${agitId}/accounts/dues/manage` }}
            rightButton={{ text: '회비 납부하기', as: 'link', href: `/service/agits/${agitId}/accounts/dues` }}
          />
        ) : agit?.memberRole === 'MEMBER' ? (
          <ButtonM
            leftButton={{ text: '권한 요청하기', onClick: handlePermission }}
            rightButton={{ text: '회비 납부하기', as: 'link', href: `/service/agits/${agitId}/accounts/dues` }}
          />
        ) : agit?.memberRole === 'ADVANCED' ? (
          <ButtonM
            leftButton={{ text: '권한 요청하기', isLoading: 'true', isLoadingText: '권한 부여 대기중' }}
            rightButton={{ text: '회비 납부하기', as: 'link', href: `/service/agits/${agitId}/accounts/dues` }}
          />
        ) : (
          <ButtonL as="link" href={`/service/agits/${agitId}/accounts/dues`} style="deep">
            회비 납부하기
          </ButtonL>
        )}
      </Flex>
    </section>
  );
}
