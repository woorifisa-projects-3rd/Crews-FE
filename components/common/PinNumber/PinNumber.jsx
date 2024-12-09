'use client';

import { useEffect, useState } from 'react';
import styles from './PinNumber.module.css';
import { Box, Flex, Text } from '@radix-ui/themes';
import { ButtonM, Toast } from '@/components/common';
import { Controller, useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks';
import scrollToTop from '@/utils/scrollToTop';
import { useSignupStore } from '@/stores/authStore';
import { signUp } from '@/apis/authAPI';
import { payCrewFee, updatePinNumber, verifyPinNumber } from '@/apis/mypageAPI';
import { transfer } from '@/apis/agitsAPI';

export default function PinNumber({ defaultStage, defaultStatus, data, closeModal, callback }) {
  // 입력값 관리
  const { control, handleSubmit, reset } = useForm();
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [shuffleNumbers, setShuffleNumbers] = useState([]);
  const { toast, setToast, toastMessage, showToast } = useToast();
  const { user, setUserField } = useSignupStore();

  // stage 관리
  const router = useRouter();
  const searchParams = useSearchParams();
  const stage = searchParams?.get('stage') || defaultStage;
  const status = searchParams?.get('status') || defaultStatus;

  // 키보드 랜덤 배열
  useEffect(() => {
    const numbers = Array.from({ length: 10 }, (_, i) => i.toString());
    setShuffleNumbers(numbers.sort(() => Math.random() - 0.5));
  }, []);

  const handleClick = (number) => {
    if (pin.every((digit) => digit !== '')) return;

    const nextPin = [...pin];
    const currentIdx = nextPin.findIndex((digit) => digit == '');
    if (currentIdx != -1) {
      nextPin[currentIdx] = number;
      setPin(nextPin);
    }
  };

  const handleDelete = () => {
    const prevIdx =
      pin.findIndex((digit) => digit == '') - 1 < 0 ? pin.length - 1 : pin.findIndex((digit) => digit === '') - 1;
    if (prevIdx < 0) return;

    const nextPin = [...pin];
    nextPin[prevIdx] = '';
    setPin(nextPin);
  };

  const handleReset = () => {
    setPin(['', '', '', '', '', '']);
    reset();
  };

  const handleReSetting = () => {
    handleReset();
    setStash();
    router.push(`?stage=${stage}`);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [stash, setStash] = useState();
  const handleSubmitPinNumber = async () => {
    const pinNumber = pin.join('');
    if (pinNumber.length < 6 || pinNumber == '0') {
      scrollToTop();
      showToast('PIN번호를 입력해주세요!');
      return;
    }

    if (stage == 'create') {
      if ((user.email == '') | (user.password == '') | (user.name == '') | (user.phoneNumber == '')) {
        alert('회원정보를 먼저 입력해주세요!');
        router.push('/service/signup/step1');
        return;
      }

      if (user.addressSi == '') {
        alert('회원정보를 먼저 입력해주세요!');
        router.push('/service/signup/step2');
        return;
      }

      if (status == null) {
        setStash(pinNumber);
        router.push(`?stage=${stage}&status=confirm`);
        handleReset();
        return;
      } else if (status == 'confirm' || status == 'error') {
        if (pinNumber == stash) {
          setUserField('pinNumber', pinNumber);
          setIsLoading(true);
          const response = await signUp(
            user.email,
            user.password,
            user.name,
            user.phoneNumber,
            user.profileImage,
            user.addressDo,
            user.addressSi,
            user.addressGuGun,
            user.addressDong,
            user.pinNumber,
          );

          setIsLoading(false);
          if (response?.errorCode) {
            scrollToTop();
            showToast(response.message);
            return;
          } else {
            alert('회원가입이 완료되었습니다!');
            router.push('/service/signup/done');
            return;
          }
        } else {
          scrollToTop();
          showToast('PIN번호가 일치하지 않습니다!');
          router.push(`?stage=${stage}&status=error`);
          handleReset();
          return;
        }
      }
    }

    if (stage == 'update') {
      if (status == null) {
        const response = await verifyPinNumber(pinNumber);
        if (response?.errorCode) {
          scrollToTop();
          showToast(response.message);
          return;
        }
        alert('인증완료!');
        router.push(`?stage=${stage}&status=change`);
        handleReset();
        return;
      } else if (status == 'change') {
        setStash(pinNumber);
        router.push(`?stage=${stage}&status=changeConfirm`);
        handleReset();
        return;
      } else if (status == 'changeConfirm' || status == 'error') {
        if (pinNumber == stash) {
          setIsLoading(true);
          const response = await updatePinNumber(pinNumber);
          setIsLoading(false);

          if (response?.errorCode) {
            scrollToTop();
            showToast(response.message);
            return;
          } else {
            alert('PIN번호 변경이 완료되었습니다!');
            router.push('/service/mypage');
            return;
          }
        } else {
          scrollToTop();
          showToast('PIN번호가 일치하지 않습니다!');
          router.push(`?stage=${stage}&status=error`);
          handleReset();
          return;
        }
      }
    }

    if (stage == 'auth') {
      if (status == 'transferMyage') {
        // 마이페이지 이체 로직
        const agitId = data.agitId;
        const crewAccountId = data.crewAccountId;
        const myAccountId = data.myAccountId;
        const amount = data.amount;
        const response = await payCrewFee(pinNumber, agitId, crewAccountId, myAccountId, amount);
        if (response?.errorCode) {
          if (callback) {
            callback(false, response.message);
          }
        } else {
          if (callback) {
            callback(true, '성공적으로 이체되었습니다.', crewAccountId, myAccountId);
          }
        }
      }
      if (status == 'transferAgit') {
        // 아지트 이체 로직
        const { agitId, ...restData } = data;
        const agitData = { ...restData, pinNumber: pinNumber };
        const response = await transfer(agitId, agitData);
        if (response?.errorCode) {
          scrollToTop();
          showToast(response.message);
          return;
        }
        closeModal();
        router.push(`/service/agits/${agitId}/accounts/dues`);
        return;
      }
      if (status == 'payment') {
        // 결제 로직
      }
    }
  };

  return (
    <>
      <Toast as="alert" isActive={toast} onClose={() => setToast(false)} autoClose={1500}>
        <Text>{toastMessage}</Text>
      </Toast>
      <Flex direction="column" gap="20px" asChild>
        <form onSubmit={handleSubmit(handleSubmitPinNumber)} className={data ? styles.modal : ''}>
          <Flex direction="column" gap="10px">
            <Box className={styles.input_list}>
              <Flex gap="10px" asChild>
                <ul>
                  {pin.map((digit, i) => {
                    return (
                      <li key={`pin${i}`} className={digit != '' ? styles.active : ''}>
                        <span>
                          <Controller
                            name={`pin${i}`}
                            control={control}
                            defaultValue={digit}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                maxLength={1}
                                value={digit ? '*' : ''}
                                onChange={(e) => {
                                  const updatedPin = [...pin];
                                  updatedPin[i] = e.target.value;
                                  setPin(updatedPin);
                                }}
                                readOnly
                              />
                            )}
                          />
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </Flex>
            </Box>
            <Box className={styles.keyboard} align="center">
              <Flex justify="center" gap="10px" wrap="wrap" asChild>
                <ul>
                  {shuffleNumbers.map((number) => {
                    return (
                      <li key={`keyboard${number}`}>
                        <button type="button" key={number} onClick={() => handleClick(number)}>
                          {number}
                        </button>
                      </li>
                    );
                  })}
                  <li>
                    <button type="button" onClick={handleDelete}>
                      삭제
                    </button>
                  </li>
                </ul>
              </Flex>
            </Box>
          </Flex>
          <Box className="btn_group">
            {stage == 'create' && status == undefined && <ButtonM rightButton={{ type: 'submit', text: '생성' }} />}
            {(status == 'confirm' || (stage == 'update' && (status == undefined || status == 'changeConfirm'))) && (
              <ButtonM rightButton={{ type: 'submit', text: '확인', isLoading }} />
            )}
            {stage == 'update' && status == 'change' && (
              <ButtonM rightButton={{ type: 'submit', text: '변경', isLoading }} />
            )}
            {stage != 'auth' && status == 'error' && (
              <ButtonM
                leftButton={{ type: 'button', text: '재설정', onClick: handleReSetting }}
                rightButton={{ type: 'submit', text: '확인' }}
              />
            )}
            {stage == 'auth' && status == 'error' && (
              <ButtonM rightButton={{ type: 'button', text: '재입력', onClick: handleReset }} />
            )}
            {stage == 'auth' && status != 'error' && (
              <ButtonM
                leftButton={{ type: 'button', text: '재입력', onClick: handleReset }}
                rightButton={{ type: 'submit', text: '확인' }}
              />
            )}
          </Box>
        </form>
      </Flex>
    </>
  );
}
