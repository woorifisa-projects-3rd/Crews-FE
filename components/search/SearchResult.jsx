'use client';

import { Flex, Text } from '@radix-ui/themes';
import { Header, ImageCard, Modal } from '@/components/common';
import styles from '@/components/search/SearchResult.module.css';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useState } from 'react';
import ApplyModalContent from '@/components/agits/ApplyModalContent';
import { useSession } from 'next-auth/react';
import useModal from '@/hooks/useModal';
import ButtonL from '@/components/common/Button/ButtonL';
import { searchAgits } from '@/apis/searchAPI';
import { applyForAgit, getAgitInfo } from '@/apis/agitsAPI';

export default function SearchResult({ params }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [agit, setAgit] = useState({ id: 0, name: '' });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { data: session } = useSession();
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();

  const fetchAgits = async (keyword, page) => {
    const response = await searchAgits(keyword, page);
    return response;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchAgits(params, 0);
        setItems(response.data);
        setHasMore(response.hasNext);
        setPage(1);
      } finally {
        setIsLoading(false);
      }
    };

    if (params) {
      fetchData();
    }
  }, [params]);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await fetchAgits(params, page);
      setItems((prevItems) => [
        ...prevItems,
        ...response.data.filter((newItem) => !prevItems.some((prevItem) => prevItem.id === newItem.id)),
      ]);
      setHasMore(response.hasNext);
      setPage((prevPage) => prevPage + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async ({ keyword }) => {
    router.push(`/service/search?q=${keyword}`);
  };

  const handleCardClick = (id, name) => {
    setAgit({ id, name });
    openModal();
  };

  const handleRequest = async (agitId) => {
    const response = await applyForAgit(agitId);
    if (response?.errorCode) {
      alert(response?.message);
      return;
    }

    setItems((prevItems) => prevItems.filter((item) => item.id !== agitId));

    if (items.length <= 5 && hasMore) {
      await loadMore();
    }

    const responseAgitInfo = await getAgitInfo();
    if (!responseAgitInfo.errorCode) {
      localStorage.setItem('agitInfoList', JSON.stringify(responseAgitInfo.agitInfoList));
    }

    alert('가입 신청이 완료되었습니다.');
    closeModal();
  };

  return (
    <>
      <Header side="left">검색결과</Header>
      <div className="content">
        <section>
          <Flex direction="column" gap="20px">
            <form onSubmit={handleSubmit(onSubmit)} className={styles.search_form}>
              <input
                {...register('keyword')}
                type="text"
                id="keyword"
                placeholder="키워드를 입력해주세요!"
                defaultValue={params}
              />
              <button type="submit">
                <Image src="/icons/ico_search.svg" width={15} height={15} alt="검색하기" />
              </button>
            </form>
            <div className="result_list">
              <InfiniteScroll
                dataLength={items.length}
                next={loadMore}
                hasMore={hasMore}
                loader={
                  isLoading && (
                    <Text as="p" align="center">
                      로드 중...
                    </Text>
                  )
                }
                endMessage={
                  <Text as="p" align="center" weight="medium" mt="10px">
                    더 이상 불러올 데이터가 없습니다.
                  </Text>
                }
              >
                <Flex direction="column" gap="10px" asChild>
                  <ul>
                    {items.map((agit, i) => (
                      <li key={`agit${i}`}>
                        <div onClick={() => handleCardClick(agit.id, agit.name)}>
                          <ImageCard as="button" data={agit}></ImageCard>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Flex>
              </InfiniteScroll>
            </div>
          </Flex>
        </section>
      </div>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          closeModal={closeModal}
          header={{
            title: `${agit.name}`,
            text: '아지트에 가입하시려면 아래 사항을 확인해주세요.',
          }}
          footer={
            session && (
              <ButtonL onClick={() => handleRequest(agit.id)} type="button" style={'deep'}>
                가입신청
              </ButtonL>
            )
          }
        >
          <ApplyModalContent agitId={agit.id} />
        </Modal>
      )}
    </>
  );
}
