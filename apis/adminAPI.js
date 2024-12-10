'use server';

import instance from '@/apis/instance';

export const getAllReports = async (page) => {
  const response = await instance.get(`admin/reported/feeds?page=${page}`);
  return response;
};

export const getReport = async (id) => {
  const response = await instance.get(`admin/reported/feeds/${id}`);
  return response;
};

export const userBan = async (id) => {
  const response = await instance.post(`admin/ban?memberId=${id}`);
  return response;
};
