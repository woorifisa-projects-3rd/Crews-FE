'use client';

import { Flex, Text } from '@radix-ui/themes';
import { ImageCard, ImageCardSkeleton } from '@/components/common';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function SubjectAgitList({ data, hasMore, loadMore, cateLoading, openModal, handleCardClick }) {
  return (
    <section>
      <InfiniteScroll dataLength={data?.length} hasMore={hasMore} next={loadMore} loader={<ImageCardSkeleton />}>
        <Flex direction="column" gap="10px" asChild>
          <ul>
            {cateLoading &&
              Array.from({ length: 10 }).map((_, i) => {
                return (
                  <li key={`newSkeleton${i + 6}`}>
                    <ImageCardSkeleton />
                  </li>
                );
              })}
            {data == undefined || data.length == 0 ? (
              <Text as="p" weight="medium">
                카테고리에 해당하는 아지트가 존재하지 않습니다.
              </Text>
            ) : (
              data.map((agit, i) => {
                return (
                  <li
                    key={`agit${i}`}
                    onClick={() => {
                      handleCardClick(agit.id, agit.name);
                    }}
                  >
                    <ImageCard as="button" data={agit} onClick={openModal} />
                  </li>
                );
              })
            )}
          </ul>
        </Flex>
      </InfiniteScroll>
    </section>
  );
}
