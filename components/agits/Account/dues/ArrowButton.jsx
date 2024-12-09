'use client';

import { Title } from '@/components/common';
import { Box, Flex, Text } from '@radix-ui/themes';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const ArrowButton = ({ data, handleDateChange = () => {} }) => {
  const today = new Date();
  const [date, setDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });

  useEffect(() => {
    handleDateChange(date);
  }, [date, handleDateChange]);

  const handlePreviousMonth = () => {
    setDate((prevDate) => {
      const minYear = data?.minYear;
      const minMonth = data?.minMonth;
      const newMonth = prevDate.month - 1;
      const newYear = newMonth === 0 ? prevDate.year - 1 : prevDate.year;
      const adjustedMonth = newMonth === 0 ? 12 : newMonth;

      const isPreviousMonthValid = newYear > minYear || (newYear === minYear && adjustedMonth >= minMonth);

      if (isPreviousMonthValid) {
        return { year: newYear, month: adjustedMonth };
      } else {
        return prevDate;
      }
    });
  };

  const handleNextMonth = () => {
    setDate((prevDate) => {
      const today = new Date();
      const newMonth = prevDate.month + 1 === 13 ? 1 : prevDate.month + 1;
      const newYear = prevDate.month + 1 === 13 ? prevDate.year + 1 : prevDate.year;

      const isNextMonthValid =
        newYear < today.getFullYear() || (newYear === today.getFullYear() && newMonth <= today.getMonth() + 1);

      if (isNextMonthValid) {
        return { year: newYear, month: newMonth };
      } else {
        return prevDate;
      }
    });
  };
  return (
    <Box align="center">
      <Flex direction="column" gap="5px">
        <Flex justify="center" gap="10px">
          <button onClick={handlePreviousMonth}>
            <Image src="/icons/ico_left-arrow.svg" width={18} height={10} alt="Left Arrow" />
          </button>
          <Title>{`${date.year}년 ${date.month}월 회비`}</Title>
          <button onClick={handleNextMonth}>
            <Image src="/icons/ico_right-arrow.svg" width={18} height={10} alt="Right Arrow" />
          </button>
        </Flex>
        <Text as="p" size="2" weight="medium" className="gray_btn">
          {data?.dueDay === null
            ? `공통회비를 설정 해 주세요!!`
            : `매월 ${data?.dueDay}일, ${data?.dueAmount?.toLocaleString('ko-KR')}원`}
        </Text>
      </Flex>
    </Box>
  );
};

export default ArrowButton;
