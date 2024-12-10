'use client';

import { useModal } from '@/hooks';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ButtonM, ButtonS, Modal, Title } from '../common';
import { Box, Flex, Text } from '@radix-ui/themes';
import Image from 'next/image';
import styles from './FeedList.module.css';
import Link from 'next/link';
import { createFeed, getFeeds } from '@/apis/agitsAPI';
import { deleteFileFromS3, getSignedS3Url, uploadFileToS3 } from '@/utils/s3utills';
import { useRouter } from 'next/navigation';
import { date } from '@/utils/date';

export default function FeedList({ agitId }) {
  const [feeds, setFeeds] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleCardClick = (feedId) => {
    if (agitId) {
      router.push(`/agits/${agitId}/feeds/${feedId}`);
    } else {
      console.error('agitId is undefined');
    }
  };
  const fetchFeeds = async (currentPage) => {
    if (!hasNext || isLoading) return;
    setIsLoading(true);
    try {
      const response = await getFeeds(agitId, currentPage);
      const newFeeds = response.data.map((feed) => ({
        id: feed.id,
        image: feed.image,
        content: feed.content,
        date: date(feed.date),
        name: feed.decryptedName,
        likeFeed: feed.likeFeed,
      }));

      // 중복 제거 로직
      setFeeds((prev) => {
        const existingIds = {};
        prev.forEach((feed) => (existingIds[feed.id] = true));
        const uniqueFeeds = newFeeds.filter((feed) => !existingIds[feed.id]);
        return [...prev, ...uniqueFeeds];
      });

      setHasNext(response.hasNext);
    } catch (error) {
      console.error('Failed to fetch feeds', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchFeeds(page);
  }, [page]);

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && hasNext) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNext]);
  const { isOpen, openModal, closeModal } = useModal();
  const [existingFile, setExistingFile] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [fileName, setFileName] = useState('');
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setValue('file', file);
    }
  };
  const onSubmit = async (data) => {
    console.log('submit data: ', data);
    try {
      // 기존 이미지 URL 저장
      let imageUrl = existingFile;

      // 새 파일이 선택된 경우
      if (data.file) {
        // 파일 형식 검증
        if (!['image/png', 'image/jpeg'].includes(data.file.type)) {
          alert('지원하지 않는 파일 형식입니다. png 또는 jpg 이미지만 업로드할 수 있습니다.');
          return;
        }

        // 기존 파일 삭제 (필요한 경우)
        if (existingFile) {
          await deleteFileFromS3(existingFile, 'feed');
        }

        // S3 업로드 처리
        const { signedUrl, fileName } = await getSignedS3Url(data.file.type, 'feed');
        await uploadFileToS3(signedUrl, data.file);

        // 새로 업로드된 파일 URL 업데이트
        imageUrl = fileName;
      }
      const formData = {
        image: imageUrl,
        content: data.content,
      };
      console.log('formed data: ', formData);
      await createFeed(agitId, formData);
      closeModal();
    } catch (error) {
      console.error('업데이트 중 오류 발생:', error);
      alert('업데이트에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        header={{ title: '활동 기록 등록하기' }}
        footer={
          <ButtonM
            leftButton={{ text: '취소', onClick: closeModal }}
            rightButton={{ text: '등록하기', onClick: handleSubmit(onSubmit) }}
          />
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="10px">
            <Box className="row">
              <Text as="label" className="require">
                활동 이미지
              </Text>
              <Box className="input input_btn input_file">
                <input
                  type="file"
                  id="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  {...register('file')}
                  onChange={onFileChange}
                />
                <input
                  id="image"
                  type="text"
                  value={fileName}
                  placeholder="이미지를 추가해주세요"
                  className={errors.file ? 'error' : ''}
                  readOnly
                />

                <label htmlFor="file">파일 선택</label>
              </Box>
              {errors.file && (
                <Text as="p" className="error">
                  {errors.file.message}
                </Text>
              )}
            </Box>
            <Box className="row">
              <Text as="label" className="require">
                활동 내용
              </Text>
              <Box className="textarea">
                <textarea
                  id="content"
                  placeholder="기록하고 싶은 활동 내용을 적어주세요"
                  {...register('content', {
                    required: '한줄 소개를 입력해주세요.',
                  })}
                  className={errors.content ? 'error' : ''}
                />
              </Box>
              {errors.content && (
                <Text as="p" className="error">
                  {errors.content.message}
                </Text>
              )}
            </Box>
          </Flex>
        </form>
      </Modal>

      <Flex direction="column" gap="10px" className="content">
        <section>
          <Flex direction="column" gap="20px">
            <Box className="title_btn">
              <Title>활동 기록</Title>
              <div className="right_top">
                <ButtonS style="deep" onClick={openModal}>
                  등록하기
                </ButtonS>
              </div>
            </Box>
            <Box className={styles.feed_list}>
              <Flex gap="10px" wrap="wrap" asChild>
                <ul>
                  {feeds.map((feed, i) => (
                    <li key={`feed${i}`}>
                      <Flex direction="column" gap="10px">
                        <Box className={styles.feed_btn}>
                          <Image
                            src={`https://djogyo1sj025q.cloudfront.net/${feed.image}` || '/imgs/img_bg_feed.jpg'}
                            width={190}
                            height={147}
                            alt={`${feed.content} 이미지`}
                          />
                          {/* <button
                            onClick={(e) => {
                              console.log(e.target);
                              setIsLiked(!isLiked);
                            }}
                          >
                            {isLiked ? (
                              <svg
                                width="16"
                                height="14"
                                viewBox="0 0 16 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M0 4.75923C0 8.71394 3.21554 10.8214 5.56938 12.7077C6.4 13.3733 7.2 14 8 14C8.8 14 9.6 13.3733 10.4306 12.7077C12.7845 10.8214 16 8.71394 16 4.75923C16 0.804497 11.5998 -2.00012 8 1.80191C4.40013 -2.00012 0 0.804497 0 4.75923Z"
                                  fill="#CE292E"
                                />
                              </svg>
                            ) : (
                              <svg
                                width="16"
                                height="14"
                                viewBox="0 0 16 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8 2.21894L8.40216 2.60799C8.29693 2.71788 8.15174 2.77996 8 2.77996C7.84826 2.77996 7.70307 2.71788 7.59784 2.60799L8 2.21894ZM9.9155 11.8097C11.0434 10.9159 12.2768 10.0431 13.2552 8.93566C14.2145 7.84982 14.8837 6.58287 14.8837 4.93914H16C16 6.93303 15.1736 8.45415 14.0899 9.6807C13.0253 10.8856 11.6683 11.8496 10.6066 12.6909L9.9155 11.8097ZM14.8837 4.93914C14.8837 3.33022 13.9793 1.98098 12.7447 1.41373C11.5453 0.862641 9.93365 1.00858 8.40216 2.60799L7.59784 1.82989C9.41507 -0.067883 11.5244 -0.380658 13.2087 0.393235C14.8579 1.15096 16 2.91042 16 4.93914H14.8837ZM10.6066 12.6909C10.2254 12.9929 9.81616 13.315 9.40145 13.5586C8.98687 13.8021 8.51379 14 8 14V12.8779C8.2304 12.8779 8.50151 12.7877 8.83825 12.5898C9.17485 12.3921 9.52403 12.1199 9.9155 11.8097L10.6066 12.6909ZM5.39341 12.6909C4.33176 11.8496 2.97466 10.8856 1.9101 9.6807C0.826419 8.45415 0 6.93303 0 4.93914H1.11628C1.11628 6.58287 1.78545 7.84982 2.74478 8.93566C3.72324 10.0431 4.95658 10.9159 6.08447 11.8097L5.39341 12.6909ZM0 4.93914C0 2.91042 1.1421 1.15096 2.79129 0.393235C4.47561 -0.380658 6.58493 -0.067883 8.40216 1.82989L7.59784 2.60799C6.06638 1.00858 4.45477 0.862641 3.25537 1.41373C2.02076 1.98098 1.11628 3.33022 1.11628 4.93914H0ZM6.08447 11.8097C6.47598 12.1199 6.82515 12.3921 7.16175 12.5898C7.49849 12.7877 7.7696 12.8779 8 12.8779V14C7.48621 14 7.01313 13.8021 6.59855 13.5586C6.18381 13.315 5.77466 12.9929 5.39341 12.6909L6.08447 11.8097Z"
                                  fill="#CE292E"
                                />
                              </svg>
                            )}
                          </button> */}
                        </Box>
                        <Link href={`/service/agits/${agitId}/feeds/${feed?.id}`}>
                          <Flex direction="column" gap="5px">
                            <Flex justify="between" align="center" wrap="wrap" className={styles.info}>
                              <em>{feed.date}</em>
                              <b className="gray_t1">{feed.name}</b>
                            </Flex>
                            <Text as="p" size="1" weight="medium" className="gray_t1">
                              {feed.content}
                            </Text>
                          </Flex>
                        </Link>
                      </Flex>
                    </li>
                  ))}
                </ul>
              </Flex>
            </Box>
          </Flex>
        </section>
      </Flex>
    </>
  );
}
