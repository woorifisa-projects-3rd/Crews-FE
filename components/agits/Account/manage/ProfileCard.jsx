'use client';

import { Text, Flex } from '@radix-ui/themes';
import styles from './ProfileCard.module.css';
import Image from 'next/image';
import useSWR from 'swr';
import instance from '@/apis/instance';
import { callDues } from '@/apis/agitsAPI';
import { useState } from 'react';

export default function ProfileCard({ agitId, commonDues, profileData, yearAndMonth }) {
  const [isDisabled, setIsDisabled] = useState(false);

  const { data } = useSWR('members/me/profile', () => instance.get('members/me/profile'), {
    fallbackData: profileData,
  });

  const handleCall = async () => {
    const duesData = {
      memberId: [data.memberId],
      duesAmount: commonDues?.dueAmount,
      year: yearAndMonth?.year,
      month: yearAndMonth?.month,
    };

    const response = await callDues(agitId, duesData);

    if (response?.errorCode) {
      console.log(response.message);
      alert('에러가 발생했습니다. 다시 실행 해 주세요.');
    } else if (response) {
      setIsDisabled(true);
      alert('문자가 발송되었습니다.');
    }
  };

  return (
    <li className={styles.profile}>
      <Flex justify="between" align="center" gap="10px">
        <Flex align="center" gap="20px">
          <div className={styles.img_box}>
            <div
              className={`${styles.profile_img} back_img ${data.profileImage == null ? styles.blank : ''}`}
              style={{
                backgroundImage: `url(${data.profileImage == null || data.profileImage == '' ? '(/imgs/img_bg_profile.jpg)' : data.profileImage})`,
              }}
            >
              <Image src="/imgs/img_bg_profile.jpg" width={56} height={56} alt={`${data.profileImage} 프로필 이미지`} />
            </div>
          </div>
          <div className={styles.txt_box}>
            <strong>
              <Text as="p" size="3">
                <span className="underline">
                  {data.name} · {data.nickname}
                </span>
                <span> 님</span>
              </Text>
            </strong>
            <Text as="p" size="2" className="gray_t2">
              {data.email}
            </Text>
          </div>
        </Flex>
        <button className={`${styles.btn_submit} red`} onClick={handleCall} disabled={isDisabled}>
          납부 요청
        </button>
      </Flex>
    </li>
  );
}
