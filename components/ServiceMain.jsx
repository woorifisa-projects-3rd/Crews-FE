import { Box, Flex, Text } from '@radix-ui/themes';
import ApplyModalContent from './agits/ApplyModalContent';
import { ButtonL, ImageCard, ImageCardSkeleton, Modal, Title, Toast } from '@/components/common';
import { useSession } from 'next-auth/react';
import { useModal, useToast } from '@/hooks';
import useSWR from 'swr';
import { applyForAgit, getAgits, getRecruitNewAgits } from '@/apis/agitsAPI';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import scrollToTop from '@/utils/scrollToTop';
import SubjectAgitList from './agits/SubjectAgitList';
import styles from './ServiceMain.module.css';

export default function ServiceMain() {
  const { isOpen, openModal, closeModal } = useModal();
  const { toast, setToast, toastMessage, showToast } = useToast();
  const { data: recruitNewAgits, isLoading: recruitNewLoading } = useSWR(
    `agits/home`,
    async () => await getRecruitNewAgits(),
  );

  if (recruitNewAgits?.errorCode) {
    showToast(recruitNewAgits.message);
  }

  const [id, setId] = useState(3);

  const searchParams = useSearchParams();
  useEffect(() => {
    const searchId = searchParams?.get('id');
    if (searchId && searchId !== id) {
      setId(searchId);
    }
  }, [searchParams, id]);

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [agit, setAgit] = useState({ id: 0, name: '' });

  const {
    data: cateAgits,
    isLoading: cateLoading,
    mutate: cateMutate,
  } = useSWR(`agits?subject-id=${id}&page=${page}`, async () => await getAgits(id, page));

  const fetchData = async () => {
    if (cateLoading) return;

    if (page == 0) setData([...cateAgits.data]);
    else setData((prev) => [...prev, ...cateAgits.data]);
  };

  const loadMore = () => {
    if (cateAgits?.hasNext && !cateLoading) {
      setPage((prev) => prev + 1);
      fetchData();
      cateMutate();
    }
  };

  useEffect(() => {
    if (!cateLoading) fetchData();
  }, [cateLoading]);

  useEffect(() => {
    setData([]);
    setPage(0);
    fetchData();
    cateMutate();
  }, [id]);

  const handleCardClick = (id, name) => {
    setAgit({ id, name });
    openModal();
  };

  const handleRequest = async (agitId) => {
    const response = await applyForAgit(agitId);
    if (response?.errorCode) {
      closeModal();
      scrollToTop();
      showToast(response?.message);
      return;
    }

    setData((prev) => prev.filter((item) => item.id !== agitId));

    alert('가입 신청이 완료되었습니다.');
    closeModal();
  };

  const { data: session } = useSession();
  return (
    <>
      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        header={{ title: agit.name, text: '아지트에 가입하시려면 아래 사항을 확인해주세요.' }}
        footer={
          session && (
            <ButtonL style="deep" onClick={() => handleRequest(agit.id)}>
              가입신청
            </ButtonL>
          )
        }
      >
        <ApplyModalContent agitId={agit.id} />
      </Modal>
      <Toast
        as="alert"
        isActive={toast}
        onClose={() => {
          setToast(false);
        }}
      >
        {toastMessage}
      </Toast>
      <Flex direction="column" gap="10px" className="content">
        {searchParams.size <= 0 ? (
          <>
            <section>
              <Flex direction="column" gap="20px">
                <Box className={styles.main_visual}>
                  <Flex justify="end" align="center" className={styles.title}>
                    <h1>크루즈</h1>
                  </Flex>
                  <div className={styles.hashtag}>
                    <ul>
                      <li className={styles.tag_1}>#소모임</li>
                      <li className={styles.tag_2}>#모임통장</li>
                      <li className={styles.tag_3}>#통합서비스</li>
                    </ul>
                  </div>
                </Box>
                <Box>
                  <div className={styles.sec_tit}>
                    <Title>모집 마감 임박</Title>
                    <Text as="p" size="2" weight="light">
                      곧 정원이 마감되는 아지트에 가입해보세요!
                    </Text>
                  </div>
                  <Box className={styles.sec_con} mt="15px">
                    <Flex direction="column" gap="10px" asChild>
                      <ul>
                        {recruitNewLoading
                          ? [0, 1, 2].map((_, i) => {
                              return (
                                <li key={`recruitSkeleton${i}`}>
                                  <ImageCardSkeleton />
                                </li>
                              );
                            })
                          : recruitNewAgits?.recruitList.map((agit, i) => {
                              return (
                                <li
                                  key={`agit${i}`}
                                  onClick={() => {
                                    handleCardClick(agit.id, agit.name);
                                  }}
                                >
                                  <ImageCard as="button" data={agit} />
                                </li>
                              );
                            })}
                      </ul>
                    </Flex>
                  </Box>
                </Box>
              </Flex>
            </section>
            <section>
              <div className={styles.sec_tit}>
                <Title>신규 아지트</Title>
                <Text as="p" size="2" weight="light">
                  방금 새로 개설된 아지트를 살펴보세요!
                </Text>
              </div>
              <Box className={styles.sec_con} mt="15px">
                <Flex direction="column" gap="10px" asChild>
                  <ul>
                    {recruitNewLoading
                      ? [3, 4, 5].map((_, i) => {
                          return (
                            <li key={`newSkeleton${i}`}>
                              <ImageCardSkeleton />
                            </li>
                          );
                        })
                      : recruitNewAgits?.newAgitList.map((agit, i) => {
                          return (
                            <li
                              key={`agit${i}`}
                              onClick={() => {
                                handleCardClick(agit.id, agit.name);
                              }}
                            >
                              <ImageCard as="button" data={agit} />
                            </li>
                          );
                        })}
                  </ul>
                </Flex>
              </Box>
            </section>
          </>
        ) : (
          <SubjectAgitList
            data={data}
            hasMore={cateAgits?.hasNext}
            loadMore={loadMore}
            cateLoading={cateLoading}
            openModal={openModal}
            handleCardClick={handleCardClick}
          />
        )}
      </Flex>
    </>
  );
}
