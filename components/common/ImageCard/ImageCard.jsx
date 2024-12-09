import { Box, Card, Flex, Text } from '@radix-ui/themes';
import styles from './ImageCard.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function ImageCard({ as = 'link', type = 'agits', data, dynamicId, onClick }) {
  const isAgit = type == 'agits';
  const content = (
    <>
      <Flex gap="15px">
        <Box className={styles.img_box}>
          <Box
            className={`back_img ${data.image ? '' : styles.blank}`}
            style={{
              backgroundImage: `url(${data?.image == null || data?.image == '' ? '/imgs/img_bg_card.jpg' : data?.image})`,
            }}
          >
            <Image src="/imgs/img_bg_card.jpg" width={65} height={65} alt={`${data.name} 소개 이미지`} />
          </Box>
        </Box>
        <Box className={styles.txt_box}>
          <Box className={styles.txt}>
            <Box className={styles.title}>
              <Flex align="center" gap="17px">
                <em className="txt_line">{data.name}</em>
                {isAgit && (
                  <Text as="p" size="2" weight="medium">
                    {data.currentNum}/{data.maxNum}
                  </Text>
                )}
              </Flex>
            </Box>
            <Box className={styles.intro} align="left">
              <Text as="p" size="2" weight="medium" className="txt_line">
                {data.introduction}
              </Text>
            </Box>
          </Box>

          <Box className={styles.hashtag}>
            <Flex gap="5px" wrap="wrap" asChild>
              <ul>
                {isAgit ? (
                  data.interests.map((interest, i) => (
                    <li key={`interest${i}`}>
                      <Flex gap="5px" align="center">
                        <Text as="span" size="1" weight="medium">
                          #{interest}
                        </Text>
                      </Flex>
                    </li>
                  ))
                ) : (
                  <>
                    <li>
                      <Flex gap="5px" align="center">
                        <Image src="/icons/ico_location.svg" width={9} height={12} alt="정모위치" />
                        <Text as="span" size="1" weight="medium">
                          {data.place}
                        </Text>
                      </Flex>
                    </li>
                    <li>
                      <Flex gap="5px" align="center">
                        <Image src="/icons/ico_date.svg" width={10} height={10} alt="정모날짜" />
                        <Text as="span" size="1" weight="medium">
                          {data.date}
                        </Text>
                      </Flex>
                    </li>
                  </>
                )}
              </ul>
            </Flex>
          </Box>
        </Box>
      </Flex>
      {isAgit && (
        <Text as="p" className={styles.category}>
          <i>{data.subject}</i>
        </Text>
      )}
    </>
  );

  return (
    <Card className={`${styles.card} card_link`}>
      {as == 'link' ? (
        <Link href={isAgit ? `/service/agits/${data.id}` : `/service/agits/${dynamicId}/meetings/${data.id}`}>
          {content}
        </Link>
      ) : (
        <button type="button" onClick={onClick}>
          {content}
        </button>
      )}
    </Card>
  );
}
