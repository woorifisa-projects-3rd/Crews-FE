'use server';
import instance from '@/apis/instance';

//공통 회비 조회(남은 회비 잔액, 회비 날짜)
export const getDues = async (id) => {
  const response = await instance.get(`agits/${id}/dues`);
  return response;
};

//공통 회비 조회(남은 회비 잔액, 회비 날짜)
export const getCommonDues = async (id) => {
  const response = await instance.get(`agits/${id}/managements/dues/common`);
  return response;
};

//모든 개인,모임통장 조회
export const getAllAccounts = async () => {
  const response = await instance.get(`accounts`);
  return response;
};

// 가입한 아지트 목록 및 역할 조회
export const getAgitInfo = async () => {
  const response = await instance.get('agits/info');
  return response;
};

// 모임통장 정보
export const getAccount = async (id) => {
  const response = await instance.get(`agits/${id}/accounts`);
  return response;
};

//모임통장 기록 확인
export const getAccountDetails = async (id, selectPeriod, transactionType, order) => {
  const response = await instance.get(
    `agits/${id}/accounts/details?selectPeriod=${selectPeriod}&transactionType=${transactionType}&order=${order}`,
  );
  return response;
};

// 모임통장에 이체정보 확인
export const getMyAccountHistory = async (date) => {
  const response = await instance.get(`accounts/history?year=${date.year}&month=${date.month}`);
  return response;
};

// 아지트 조회
export const getAllAgits = async () => {
  const response = await instance.get(`agits`);
  return response;
};

// 아지트 정모 조회
export const getAllMeetings = async (id) => {
  const response = await instance.get(`agits/${id}/meetings`);
  return response;
};

// 아지트 정모 상세 조회
export const getMeeting = async (agitId, meetingId) => {
  const response = await instance.get(`agits/${agitId}/meetings/${meetingId}`);
  return response;
};

export const getMeetingForEdit = async (agitId, meetingId) => {
  const response = await instance.get(`agits/${agitId}/meetings/${meetingId}/edit`);
  return response;
};

// 아지트 기록 상세 조회
export const getFeed = async (agitId, feedId) => {
  const response = await instance.get(`agits/${agitId}/feeds/${feedId}`);
  return response;
};

// 아지트 기록 수정
export const getFeedForEdit = async (agitId, feedId) => {
  const response = await instance.get(`agits/${agitId}/feeds/${feedId}/edit`);
  return response;
};
// 아지트 기록 좋아요
export const heartFeed = async (agitId, feedId) => {
  const response = await instance.post(`agits/${agitId}/feeds/${feedId}/heart`);
  return response;
};

// 아지트 기록 신고하기
export const reportFeed = async (agitId, feedId, data) => {
  const response = await instance.post(`agits/${agitId}/feeds/${feedId}`, {
    body: JSON.stringify({ ...data }),
  });
  return response;
};
// 아지트 소개 조회
export const getIntroducing = async (id) => {
  const response = await instance.get(`agits/${id}/introducing`);
  return response;
};

// 아지트 소개 수정
export const getIntroducingForEdit = async (id) => {
  const response = await instance.get(`agits/${id}/introducing/edit`);
  return response;
};

export const updateIntroducing = async (id, data) => {
  const response = await instance.patch(`agits/${id}/introducing/edit`, {
    body: JSON.stringify({ ...data }),
  });
  return response;
};
