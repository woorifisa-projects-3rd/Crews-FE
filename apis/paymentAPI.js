'use server';

import instance from './instance';

// 아지트 및 카드정보 가져오기
export const getAgitAndCardInfo = async () => {
  const response = await instance.get('payments');
  return response;
};

// QR Code 생성
export const getQRCode = async (paymentData) => {
  const response = await instance.post('payments', {
    body: JSON.stringify(paymentData),
  });
  return response;
};

// 결제 결과 가져오기
export const getPaymentResult = async () => {
  const response = await instance.get('payments/result');
  return response;
};

// 결제 권한 요청
export const requestAccountAuthority = async (agitsId) => {
  const response = await instance.post(`agits/${agitsId}/accounts/permissions`);
  return response;
};
