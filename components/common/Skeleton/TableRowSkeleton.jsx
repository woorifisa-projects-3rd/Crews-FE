import { Skeleton, Table } from '@radix-ui/themes';

export default function TableRowSkeleton() {
  return (
    <Table.Root>
      <colgroup>
        <col width="80px" />
        <col width="*" />
        <col width="*" />
        <col width="130px" />
        <col width="80px" />
      </colgroup>
      <Table.Body align="center">
        <Table.Row>
          <Table.Cell>
            <Skeleton>번호</Skeleton>
          </Table.Cell>
          <Table.Cell align="left">
            <Skeleton>활동기록 활동기록 활동기록 활동기록</Skeleton>
          </Table.Cell>
          <Table.Cell align="left">
            <Skeleton>신고사유 신고사유 신고사유 신고사유</Skeleton>
          </Table.Cell>
          <Table.Cell>
            <Skeleton>상세보기</Skeleton>
          </Table.Cell>
          <Table.Cell>
            <Skeleton>확인</Skeleton>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}
