'use server';
import instance from './instance';

// 전체 관심사 목록 조회
export const getAllInterests = async () => {
  const response = await instance.get('interests');
  return response;
};
