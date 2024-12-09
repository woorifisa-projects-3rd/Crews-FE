'use server';
import instance from './instance';

export const searchAgits = async (keyword, page) => {
  const response = await instance.get(`agits/search?keyWord=${keyword}&page=${page}`);
  return response;
};

export const getAgitIntroducing = async (agitId) => {
  const response = await instance.get(`agits/${agitId}/introducing`);
  return response;
};

export const getAgitMeetings = async (agitId) => {
  const response = await instance.get(`agits/${agitId}/meetings/recent`);
  return response;
};

export const getAgitDues = async (agitId) => {
  const response = await instance.get(`agits/${agitId}/managements/dues/common`);
  return response;
};
