'use client';

import { useEffect, useState } from 'react';
import AgitHeader from '@/components/agits/AgitHeader';
import { Callout, Flex } from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import NoAccount from './NoAccount';
import Account from './Account';
import { ButtonM, Title } from '@/components/common';
import { cardIssuance, cardIssued, cardRemoved, getAgitInfo, sendPermission } from '@/apis/agitsAPI';
import useSWR from 'swr';
import { useCallAgitInfo } from '@/hooks';
import { useAgitInfoStore } from '@/stores/authStore';

export default function AccountAndHeader({ agitId, dues, data, isCard }) {
  useEffect(() => {
    const fetchAgitInfo = async () => {
      const response = await getAgitInfo();
      if (!response.errorCode) {
        localStorage.setItem('agitInfoList', JSON.stringify(response.agitInfoList));
      }
    };

    fetchAgitInfo();
  }, []);
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
    const permission = await sendPermission(agitId);
    if (permission?.errorCode) {
      console.log(permission.message);
      alert('에러가 발생했습니다. 다시 실행 해 주세요.');
    } else if (permission) {
      alert('권한 요청이 되었습니다.');
    }
  };

  const handleCardIssued = async () => {
    const cardInfo = await cardIssued(agitId);
    if (cardInfo?.errorCode) {
      alert(cardInfo.message);
    } else if (cardInfo) {
      alert('카드 발급이 되었습니다.');
    }
  };

  const { data: cardIssuanceInfo, mutate } = useSWR(
    `agits/${agitId}/accounts/cards`,
    async () => {
      const response = await cardIssuance(agitId);
      return response;
    },
    {
      fallbackData: isCard,
    },
  );

  const handleCardRemoved = async () => {
    const cardRemoveData = {
      cardNumber: cardIssuanceInfo.cardNumber,
    };

    const cardRemove = await cardRemoved(agitId, cardRemoveData);
    if (cardRemove?.errorCode) {
      alert(cardRemove.message);
    } else if (cardRemove) {
      alert('카드 해지되었습니다.');
    }
  };
  return (
    <>
      <AgitHeader currentId={agitId} />
      <Flex direction="column" gap="10px" className="content">
        <section>
          <Flex direction="column" gap="20px">
            {data?.ci != null && dues.dueAmount != null && (
              <>
                {dues.dueAmount !== 0.0 ? (
                  <Callout.Root color="red">
                    <Callout.Icon>
                      <InfoCircledIcon />
                    </Callout.Icon>
                    <Callout.Text>{`회비 납부일이 지났어요! 빨리 ${dues.dueAmount.toLocaleString('ko-KR')}원을 납부해주세요.`}</Callout.Text>
                  </Callout.Root>
                ) : (
                  ''
                )}

                <Callout.Root color="green">
                  <Callout.Icon>
                    <InfoCircledIcon />
                  </Callout.Icon>
                  <Callout.Text>{`매월 ${dues.dueDay}일은 모임 회비를 납부하는 날입니다.`}</Callout.Text>
                </Callout.Root>
              </>
            )}
          </Flex>
          {data.ci != null ? (
            <Flex direction="column" gap="20px">
              <Title>모임통장</Title>
              {<Account data={data} hide={true} />}
              {agit?.memberRole !== 'LEADER' ? (
                agit?.memberRole === 'MEMBER' ? (
                  <ButtonM
                    leftButton={{ text: '권한 요청하기', onClick: handlePermission }}
                    rightButton={{ text: '상세 내역보기', as: 'link', href: `/service/agits/${agitId}/accounts` }}
                  />
                ) : agit?.memberRole === 'ADVANCED' ? (
                  <ButtonM
                    leftButton={{ text: '권한 요청하기', isLoading: 'true' }}
                    rightButton={{ text: '상세 내역보기', as: 'link', href: `/service/agits/${agitId}/accounts` }}
                  />
                ) : !cardIssuanceInfo.cardExist ? (
                  <ButtonM
                    leftButton={{ text: '카드 발급하기', onClick: handleCardIssued }}
                    rightButton={{ text: '상세 내역보기', as: 'link', href: `/service/agits/${agitId}/accounts` }}
                  />
                ) : (
                  <ButtonM
                    leftButton={{ text: '카드 해지하기', onClick: handleCardRemoved }}
                    rightButton={{ text: '상세 내역보기', as: 'link', href: `/service/agits/${agitId}/accounts` }}
                  />
                )
              ) : !cardIssuanceInfo.cardExist ? (
                <ButtonM
                  leftButton={{ text: '카드 발급하기', onClick: handleCardIssued }}
                  rightButton={{ text: '상세 내역보기', as: 'link', href: `/service/agits/${agitId}/accounts` }}
                />
              ) : (
                <ButtonM
                  leftButton={{ text: '카드 해지하기', onClick: handleCardRemoved }}
                  rightButton={{ text: '상세 내역보기', as: 'link', href: `/service/agits/${agitId}/accounts` }}
                />
              )}
            </Flex>
          ) : (
            agit?.memberRole === 'LEADER' && (
              <>
                <NoAccount></NoAccount>
                <ButtonM
                  leftButton={{ text: '연결하기' }}
                  rightButton={{ text: '생성하기', as: 'link', href: `/service/agits/${agitId}/accounts/create` }}
                />
              </>
            )
          )}
        </section>
      </Flex>
    </>
  );
}
