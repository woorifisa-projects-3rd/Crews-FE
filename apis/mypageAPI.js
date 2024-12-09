'use server';

import { revalidatePath } from 'next/cache';
import instance from './instance';

// 닉네임 가져오기
export const getNickname = async () => {
  const response = await instance.get('members/me/nickname');
  return response;
};

// 닉네임 수정
export const updateNickname = async (nickname) => {
  const response = await instance.put('members/me/nickname', {
    body: JSON.stringify({ nickname }),
  });
  revalidatePath('/service/mypage');
  return response;
};

// 프로필 정보 조회
export const getProfile = async () => {
  const response = await instance.get('members/me/profile');
  return response;
};

// 프로필 이미지 업데이트
export const updateProfileImage = async (profileImagePath) => {
  const response = await instance.put('members/me/profile', {
    body: JSON.stringify(profileImagePath),
  });
  revalidatePath('/service/mypage');
  return response;
};

// 프로필 이미지 삭제
export const deleteProfileImage = async () => {
  const response = await instance.delete('members/me/profile', {});
  revalidatePath('/service/mypage');
  return response;
};

// 회원 관심사 목록 조회
export const getInterests = async () => {
  const response = await instance.get('members/me/interests');
  return response;
};

// 사용자 관심사 업데이트
export const updateInterests = async (selectedInterests) => {
  const response = await instance.put('members/me/interests', {
    body: JSON.stringify(selectedInterests),
  });
  revalidatePath('/service/mypage');
  return response;
};

// 비밀번호 수정
export const updatePassword = async (oldPassword, newPassword, confirmPassword) => {
  const response = await instance.put('members/me/password', {
    body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
  });
  revalidatePath('/service/mypage');
  return response;
};

// 주소 가져오기
export const getAddresses = async () => {
  const response = await instance.get('members/me/addresses');
  return response;
};

// 주소 수정
export const updateAddresses = async (addresses) => {
  const response = await instance.put('members/me/addresses', { body: JSON.stringify(addresses) });
  revalidatePath('/service/mypage');
  return response;
};

// 모임 목록 조회
export const getMyAgit = async () => {
  const response = await instance.get('members/me/agits');
  return response;
};

// 모임카드 목록 조회
export const getMyAgitCards = async () => {
  const response = await instance.get('members/me/agits-cards');
  return response;
};

// 모임카드 해지
export const detachAgitCard = async (cardId) => {
  const response = await instance.delete(`members/me/agits-cards`, { body: JSON.stringify({ cardId }) });
  revalidatePath('/service/mypage/assets');
  return response;
};

// 개인 등록된 계좌 목록 조회
export const getPersonalAccounts = async () => {
  const response = await instance.get('members/me/my-accounts');
  return response;
};

// 개인 계좌 해지
export const detachPersonalAccount = async (accountId) => {
  const response = await instance.delete(`members/me/my-accounts`, { body: JSON.stringify({ accountId }) });
  return response;
};

// 개인 은행계좌 조회
export const getBankAccount = async (accountId, crewId) => {
  const response = await instance.get('members/me/core-accounts', {});
  return response;
};

// 개인 은행계좌 연결
export const attachBankAccount = async (accountNumbers) => {
  const response = await instance.post('members/me/core-accounts', { body: JSON.stringify({ accountNumbers }) });
  revalidatePath('/service/mypage/assets');
  return response;
};

// 회비 납부 정보 조회
export const getFeePaymentInfo = async () => {
  const response = await instance.get(`members/me/agits-accounts`);
  revalidatePath('/service/mypage/fee');
  return response.crewAccounts;
};

// 회비 납부하기
export const payCrewFee = async (pinNumber, agitId, crewAccountId, myAccountId, amount) => {
  const response = await instance.post(`members/me/fees/payment`, {
    body: JSON.stringify({ pinNumber, agitId, crewAccountId, myAccountId, amount }),
  });
  revalidatePath('/service/mypage/fee');
  return response;
};

// 거래 내역 조회
export const getTransactionHistory = async (crewAccountId, myAccountId) => {
  const response = await instance.get(
    `members/me/account-withdraws?crewAccountId=${crewAccountId}&myAccountId=${myAccountId}`,
  );
  return response;
};

// 핀번호 인증
export const verifyPinNumber = async (pinNumber) => {
  const response = await instance.post(`members/me/pin-number`, {
    body: JSON.stringify({ pinNumber }),
  });
  return response;
};

// 핀번호 변경
export const updatePinNumber = async (pinNumber) => {
  const response = await instance.put(`members/me/pin-number`, {
    body: JSON.stringify({ pinNumber }),
  });
  return response;
};
