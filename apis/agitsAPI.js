'use server';

import instance from '@/apis/instance';
import { revalidatePath } from 'next/cache';

// 카테고리별 조회
export const getAgits = async (id, page) => {
  const response = await instance.get(`agits?subject-id=${id}&page=${page}`);
  return response;
};

//공통 회비 조회(남은 회비 잔액, 회비 날짜)
export const getDues = async (agitId, date) => {
  const response = await instance.get(`agits/${agitId}/dues?year=${date.year}&month=${date.month}`);
  return response;
};

//공통 회비 조회(남은 회비 잔액, 회비 날짜)
export const getCommonDues = async (agitId) => {
  const response = await instance.get(`agits/${agitId}/managements/dues/common`);
  return response;
};

//모든 개인,모임통장 조회
export const getAllAccounts = async (date) => {
  const response = await instance.get(`accounts?year=${date.year}&month=${date.month}`);
  return response;
};

// 가입한 아지트 목록 및 역할 조회
export const getAgitInfo = async () => {
  const response = await instance.get('agits/info');
  return response;
};

// 모임통장 정보
export const getAccount = async (agitId) => {
  const response = await instance.get(`agits/${agitId}/accounts`);
  return response;
};

//모임통장 기록 확인
export const getAccountDetails = async (agitId, selectPeriod, transactionType, order) => {
  const response = await instance.get(
    `agits/${agitId}/accounts/details?selectPeriod=${selectPeriod}&transactionType=${transactionType}&order=${order}`,
  );
  return response;
};

// 모임통장에 이체정보 확인
export const getMyAccountHistory = async (date) => {
  const response = await instance.get(`accounts/history?year=${date.year}&month=${date.month}`);
  return response;
};

export const validateAgitName = async (agitName) => {
  const response = await instance.get(`agits/validate-name?agitName=${agitName}`);
  return response;
};

export const getInterest = async () => {
  const response = await instance.get(`interests`);
  return response;
};

export const createAgitRequest = async (formData) => {
  const response = await instance.post('agits', {
    body: JSON.stringify(formData),
  });
  return response;
};

// 아지트 가입신청
export const applyForAgit = async (agitId, keyWord) => {
  const response = await instance.post('agits/registrations', {
    body: JSON.stringify({ agitId }),
  });
  revalidatePath(`/service/search?q=${keyWord}`);
  return response;
};

// 모집임박/신규 아지트 조회
export const getRecruitNewAgits = async () => {
  const response = await instance.get('agits/home');
  return response;
};

// 모임통장 회비납부
export const transfer = async (agitId, data) => {
  const response = await instance.post(`agits/${agitId}/accounts/transfer`, {
    body: JSON.stringify({ ...data }),
  });
  return response;
};

// 모임통장에 이체정보 확인
export const getDuesProfile = async (agitId, date) => {
  const response = await instance.get(`agits/${agitId}/managements/dues?year=${date.year}&month=${date.month}`);
  return response;
};

// 모임통장에 입금내역 확인
export const crewAccountDepositInfo = async (agitId, date) => {
  const response = await instance.get(`agits/${agitId}/accounts/deposit?year=${date.year}&month=${date.month}`);
  return response;
};

// 모임통장에 입금내역 확인
export const setCommonDues = async (agitId, data) => {
  const response = await instance.post(`agits/${agitId}/managements/dues/common`, {
    body: JSON.stringify({ ...data }),
  });
  return response;
};

// 정모 조회
export const getMeeting = async (agitId, page, pageSize) => {
  const response = await instance.get(`agits/${agitId}/meetings?page=${page}&pageSize=${pageSize}`);
  return response;
};

// 피드 조회
export const getFeeds = async (agitId, page) => {
  const response = await instance.get(`agits/${agitId}/feeds?page=${page}`);
  return response;
};

// 모든 계좌상품 조회
export const getProducts = async () => {
  const response = await instance.get(`products`);
  return response;
};

// 모임통장 계좌 생성
export const generateAccount = async (agitId, productId) => {
  const response = await instance.post(`agits/${agitId}/accounts`, {
    body: JSON.stringify({ productId }),
  });
  return response;
};

// 모임통장 회비 납부 요청
export const callDues = async (agitId, data) => {
  const response = await instance.post(`agits/${agitId}/member/call`, {
    body: JSON.stringify({ ...data }),
  });
  return response;
};

// 모임통장 회비 변경 문자 알림
export const callDuesChange = async (agitId, data) => {
  const response = await instance.post(`agits/${agitId}/dues-call`, {
    body: JSON.stringify({ ...data }),
  });
  return response;
};

// 모임통장 권한 요청하기
export const sendPermission = async (agitId) => {
  const response = await instance.post(`agits/${agitId}/accounts/permissions`);
  return response;
};

// 모임통장 카드 발급여부 확인
export const cardIssuance = async (agitId) => {
  const response = await instance.get(`agits/${agitId}/accounts/cards`);
  return response;
};

// 모임통장 카드 발급하기
export const cardIssued = async (agitId) => {
  const response = await instance.post(`agits/${agitId}/accounts/cards`);
  return response;
};

// 모임통장 카드 발급해지하기
export const cardRemoved = async (agitId, data) => {
  const response = await instance.delete(`agits/${agitId}/accounts/cards`, {
    body: JSON.stringify({ ...data }),
  });
  return response;
};

// 아지트 조회
export const getAllAgits = async () => {
  const response = await instance.get(`agits`);
  return response;
};

// 아지트 정모 조회
export const getAllMeetings = async (agitId, page) => {
  const response = await instance.get(`agits/${agitId}/meetings?page=${page}`);
  return response;
};
// 아지트 정모 추가
export const createMeeting = async (agitId, data) => {
  const response = await instance.post(`agits/${agitId}/meetings/create`, {
    body: JSON.stringify({ ...data }),
  });
  return response;
};
// 아지트 정모 상세 조회
export const getMeetingDetails = async (agitId, meetingId) => {
  const response = await instance.get(`agits/${agitId}/meetings/${meetingId}`);
  return response;
};

// 아지트 정모 수정
export const updateMeeting = async (agitId, meetingId, data) => {
  const response = await instance.patch(`agits/${agitId}/meetings/${meetingId}/edit`, {
    body: JSON.stringify({ ...data }),
  });
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

// 아지트 기록 추가
export const createFeed = async (agitId, data) => {
  const response = await instance.post(`agits/${agitId}/feeds`, {
    body: JSON.stringify({ ...data }),
  });
  return response;
};

// 아지트 기록 수정
export const getFeedForEdit = async (agitId, feedId) => {
  const response = await instance.get(`agits/${agitId}/feeds/${feedId}/edit`);
  return response;
};

export const updateFeed = async (agitId, feedId, data) => {
  const response = await instance.patch(`agits/${agitId}/feeds/${feedId}/edit`, {
    body: JSON.stringify({ ...data }),
  });
  return response;
};

// 아지트 기록 삭제
export const deleteFeed = async (agitId, feedId) => {
  const response = await instance.delete(`agits/${agitId}/feeds/${feedId}`);
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

// 아지트 관리
export const agitManage = async (agitId) => {
  const response = await instance.get(`agits/${agitId}/manage`);
  return response;
};

// 아지트 관리 통장권한 관리
export const accountAuthorization = async (agitId, data) => {
  const response = await instance.post(`agits/${agitId}/manage/accounts`, {
    body: JSON.stringify({ ...data }),
  });
  return response;
};

// 아지트 관리 가입신청 관리
export const memberAuthorization = async (agitId, data) => {
  const response = await instance.post(`agits/${agitId}/manage/members`, {
    body: JSON.stringify({ ...data }),
  });
  return response;
};
