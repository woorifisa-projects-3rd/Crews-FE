import { Card, Flex, Skeleton, Text } from '@radix-ui/themes';

export default function ImageCardSkeleton() {
  return (
    <Card>
      <Flex gap="15px">
        <Skeleton width="70px" height="70px" />
        <Flex direction="column">
          <Text>
            <Skeleton>아지트명</Skeleton>
          </Text>
          <Text>
            <Skeleton>아지트 소개</Skeleton>
          </Text>
          <Text>
            <Skeleton>해시태그</Skeleton>
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}
