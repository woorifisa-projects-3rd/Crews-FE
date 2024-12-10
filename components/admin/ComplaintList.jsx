'use client';

import { getAllReports, userBan } from '@/apis/adminAPI';
import { useModal } from '@/hooks';
import { Table, Text } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import useSWR from 'swr';
import { ButtonL, Modal, TableRowSkeleton } from '@/components/common';
import ReportModalContent from './ReportModalContent';
import { CheckIcon } from '@radix-ui/react-icons';
import styles from './ComplaintList.module.css';

export default function ComplaintList({ initReports }) {
  const { isOpen, openModal, closeModal } = useModal();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [detailId, setDetailId] = useState({ id: 0, feedId: 0, memberId: 0 });

  const {
    data: reportData,
    isLoading,
    mutate,
  } = useSWR(`admin/reported/feeds?page=${page}`, async () => await getAllReports(page), {
    fallbackData: initReports,
  });

  const fetchData = async () => {
    if (isLoading) return;

    if (page == 0) setData([...reportData.data]);
    else setData((prev) => [...prev, ...reportData.data]);
  };

  const loadMore = () => {
    if (reportData?.hasNext && !isLoading) {
      setPage((prev) => prev + 1);
      fetchData();
      mutate();
    }
  };

  useEffect(() => {
    if (!isLoading) fetchData();
  }, [isLoading]);

  const handleModalOpen = (id, feedId, memberId) => {
    setDetailId({ id, feedId, memberId });
    openModal();

    setData((prev) => {
      return prev.map((report) => {
        if (report.id === id) {
          return { ...report, checked: true };
        }
        return report;
      });
    });
  };

  const handleUserBan = async (memberId) => {
    const response = await userBan(memberId);
    if (response?.errorCode) {
      alert(response.message);
      closeModal();
      return;
    }

    alert('멤버가 차단되었습니다!');
    closeModal();
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        header={{ title: '신고내역 상세', text: '아지트 활동기록에서 신고가 들어온 게시물 입니다.' }}
        footer={
          <ButtonL
            style="deep"
            onClick={() => {
              handleUserBan(detailId.memberId);
            }}
          >
            멤버 차단하기
          </ButtonL>
        }
      >
        <ReportModalContent mutate={mutate} feedId={detailId.feedId} />
      </Modal>
      {(data == undefined || data.length == 0) && !isLoading ? (
        <Text as="p" weight="medium">
          신고내역이 존재하지 않습니다.
        </Text>
      ) : (
        <InfiniteScroll
          dataLength={data?.length}
          hasMore={reportData?.hasNext}
          next={loadMore}
          loader={<TableRowSkeleton />}
        >
          <div className={styles.table}>
            <Table.Root variant="surface">
              <colgroup>
                <col width="80px" />
                <col width="*" />
                <col width="*" />
                <col width="130px" />
                <col width="80px" />
              </colgroup>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>no</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="left">활동기록</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="left">신고사유</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>상세보기</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>확인여부</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.map((report, i) => {
                  return (
                    <Table.Row key={`report${i}`}>
                      <Table.RowHeaderCell>{i + 1}</Table.RowHeaderCell>
                      <Table.Cell align="left">
                        <Text as="p" className="txt_line">
                          {report.feedContent}
                        </Text>
                      </Table.Cell>
                      <Table.Cell align="left">
                        <Text as="p" className="txt_line">
                          {report.content}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <button
                          className={`${styles.btn_detail} red`}
                          onClick={() => {
                            handleModalOpen(report.id, report.feedId, report.memberId);
                          }}
                        >
                          신고상세
                        </button>
                      </Table.Cell>
                      <Table.Cell>
                        <div className={styles.svg}>{report.checked && <CheckIcon />}</div>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>
          </div>
        </InfiniteScroll>
      )}
    </>
  );
}
