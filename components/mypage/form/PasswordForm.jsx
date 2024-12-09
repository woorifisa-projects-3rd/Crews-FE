'use client';

import { ButtonL, Toast } from '@/components/common';
import { Box, Flex, Text } from '@radix-ui/themes';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { updatePassword } from '@/apis/mypageAPI';
import { useToast } from '@/hooks';

export default function PasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: 'onChange',
  });
  const router = useRouter();

  const { toast, setToast, toastMessage, showToast } = useToast();
  const newPassword = watch('newPassword');

  const handleUpdatePassword = async ({ oldPassword, newPassword, confirmPassword }) => {
    const response = await updatePassword(oldPassword, newPassword, confirmPassword);
    if (response?.errorCode) {
      showToast(`${response.message}`);
    } else {
      alert('비밀번호가 성공적으로 수정되었습니다!');
      router.push('/service/mypage');
    }
  };

  return (
    <Box className="input">
      <Toast as="alert" isActive={toast} onClose={() => setToast(false)}>
        <Text>{toastMessage}</Text>
      </Toast>
      <form onSubmit={handleSubmit(handleUpdatePassword)}>
        <Flex direction="column" gap="10px">
          <Box className="row">
            <Text as="label" htmlFor="oldPassword" className="require">
              현재 비밀번호
            </Text>
            <Box className="input">
              <input
                type="password"
                id="oldPassword"
                placeholder="현재 비밀번호를 입력해주세요"
                {...register('oldPassword', {
                  required: '현재 비밀번호를 입력해주세요',
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
                    message: '특수문자(!@#$%^&*) 포함 영문, 숫자 8자리 이상',
                  },
                })}
                className={`${errors.oldPassword ? 'error' : ''}`}
              />
            </Box>
            {errors.oldPassword && (
              <Text as="p" className="error">
                {errors.oldPassword.message}
              </Text>
            )}
          </Box>

          <Box className="row">
            <Text as="label" htmlFor="newPassword" className="require">
              새 비밀번호
            </Text>
            <Box className="input">
              <input
                type="password"
                id="newPassword"
                placeholder="변경할 비밀번호를 입력해주세요"
                {...register('newPassword', {
                  required: '새 비밀번호를 입력해주세요',
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
                    message: '특수문자(!@#$%^&*) 포함 영문, 숫자 8자리 이상',
                  },
                })}
                className={`${errors.newPassword ? 'error' : ''}`}
              />
            </Box>
            {errors.newPassword && (
              <Text as="p" className="error">
                {errors.newPassword.message}
              </Text>
            )}
          </Box>

          <Box className="row">
            <Text as="label" htmlFor="confirmPassword" className="require">
              새 비밀번호 확인
            </Text>
            <Box className="input">
              <input
                type="password"
                id="confirmPassword"
                placeholder="변경할 비밀번호를 다시 한 번 입력해주세요"
                {...register('confirmPassword', {
                  required: '비밀번호 확인을 입력해주세요',
                  validate: (value) => value === newPassword || '비밀번호가 일치하지 않습니다',
                })}
                className={`${errors.confirmPassword ? 'error' : ''}`}
              />
            </Box>
            {errors.confirmPassword && (
              <Text as="p" className="error">
                {errors.confirmPassword.message}
              </Text>
            )}
          </Box>

          <ButtonL type="submit" style="deep">
            수정하기
          </ButtonL>
        </Flex>
      </form>
    </Box>
  );
}
