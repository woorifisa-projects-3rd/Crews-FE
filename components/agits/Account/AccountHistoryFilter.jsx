'use client';

import { Flex } from '@radix-ui/themes';
import { SelectFilter } from '@/components/common';
import { monthSelectMenuList, orderSelectMenuList, tranTypeSelectMenuList } from '@/constants/selectMenuList/sample';
import { useEffect, useState } from 'react';

export default function AccountHistoryFilter({ handleFilterChange = () => {} }) {
  const [selectedMonth, setSelectedMonth] = useState(3); // 기본값
  const [selectedTranType, setSelectedTranType] = useState('ALL'); // 기본값
  const [selectedOrder, setSelectedOrder] = useState('DESC'); // 기본값

  // 컴포넌트가 마운트되었을 때 기본값을 부모 컴포넌트로 전달
  useEffect(() => {
    handleFilterChange({
      selectedMonth: selectedMonth,
      selectedTranType: selectedTranType,
      selectedOrder: selectedOrder,
    });
  }, [selectedMonth, selectedTranType, selectedOrder]);

  const monthSelect = (filter, params) => {
    setSelectedMonth(params);
  };

  const tranTypeSelect = (filter, params) => {
    setSelectedTranType(params);
  };

  const orderSelect = (filter, params) => {
    setSelectedOrder(params);
  };

  return (
    <Flex justify="end" gap="5px">
      <SelectFilter filter="month" selectList={monthSelectMenuList} onSelect={monthSelect}>
        {monthSelectMenuList.find((item) => item.params === selectedMonth)?.text || 'Month'}
      </SelectFilter>
      <SelectFilter filter="tranType" selectList={tranTypeSelectMenuList} onSelect={tranTypeSelect}>
        {tranTypeSelectMenuList.find((item) => item.params === selectedTranType)?.text || 'Transaction Type'}
      </SelectFilter>
      <SelectFilter filter="order" selectList={orderSelectMenuList} onSelect={orderSelect}>
        {orderSelectMenuList.find((item) => item.params === selectedOrder)?.text || 'Order'}
      </SelectFilter>
    </Flex>
  );
}
