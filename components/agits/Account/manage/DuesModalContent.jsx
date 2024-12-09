'use client';

import { Box, Flex, Text } from '@radix-ui/themes';
import styles from './DuesModalContent.module.css';
import { ButtonM, SelectFilter } from '@/components/common';
import { daySelectMenuList } from '@/constants/selectMenuList/sample';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { setCommonDues } from '@/apis/agitsAPI';
import DuesCheckBox from './DuesCheckbox';

export default function DuesModalContent({ agitId, closeModal }) {
  const [formattedValue, setFormattedValue] = useState('');
  const [selectedDay, setSelectedDay] = useState(1);
  const [isChecked, setIsChecked] = useState(true);
  const daySelect = (filter, params) => {
    setSelectedDay(params);
  };

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleCheckboxChange = (checked) => {
    setIsChecked(checked);
  };

  const handleSubmitPattern = async (data) => {
    if (data.user_dueAmount === undefined || data.user_dueAmount === null) {
      alert('금액 및 날짜를 확인해 주세요!');
      return;
    }

    if (!isChecked) {
      alert('동의문에 체크 해 주세요');
      return;
    }

    const agitData = {
      dueDay: selectedDay,
      dueAmount: data.user_dueAmount,
    };

    const response = await setCommonDues(agitId, agitData);
    if (response?.errorCode) {
      console.log(response.message);
      alert('에러가 발생했습니다. 다시 실행 해 주세요.');
    }
    closeModal();
  };
  const handleNumberChange = (e) => {
    let input = e.target.value;
    const numericValue = input.replace(/[^0-9]/g, '');
    const formatted = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setFormattedValue(formatted);
    setValue('user_dueAmount', numericValue);
  };
  return (
    <form onSubmit={handleSubmit(handleSubmitPattern)}>
      <Flex direction="column" gap="20px">
        <div className={styles.top}>
          <Flex align="center" gap="10px">
            <Text as="p" size="2" weight="medium">
              매월
            </Text>
            <SelectFilter filter="day" selectList={daySelectMenuList} onSelect={daySelect} scrollY={true}>
              {daySelectMenuList[0].text}
            </SelectFilter>
          </Flex>

          <Flex gap="10px" align="center">
            <Box>
              <Box className={styles.input}>
                <input
                  type="text"
                  id="user_dueAmount"
                  onInput={handleNumberChange}
                  value={formattedValue}
                  className={errors.user_dueAmount ? 'error' : ''}
                />
              </Box>
              {errors.user_dueAmount && (
                <Text as="p" className="error">
                  {errors.user_dueAmount.message}
                </Text>
              )}
            </Box>
            <Text as="p" size="2" weight="medium">
              원 만큼
            </Text>
          </Flex>
        </div>
        <Flex justify="end">
          <DuesCheckBox checked={isChecked} onCheckedChange={handleCheckboxChange}>
            금액 및 날짜를 확인하셨나요?
          </DuesCheckBox>
        </Flex>
        <ButtonM leftButton={{ text: '취소' }} rightButton={{ type: 'submit', text: '신청' }} />
      </Flex>
    </form>
  );
}
