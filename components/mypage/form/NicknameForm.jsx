'use client';
import { ButtonL, Toast } from '@/components/common';
import { Box, Flex, Text } from '@radix-ui/themes';
import { updateNickname } from '@/apis/mypageAPI';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import instance from '@/apis/instance';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks';

export default function NicknameForm({ nicknameData }) {
  const { data, isLoading } = useSWR('members/me/nickname', () => instance.get('members/me/nickname'), {
    fallbackData: nicknameData,
  });

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { toast, setToast, toastMessage, showToast } = useToast();

  const handleUpdateNickname = async ({ nickname }) => {
    const nicknamePattern = /^[a-zA-Z0-9가-힣]{1,13}$/;
    if (!nicknamePattern.test(nickname)) {
      showToast('닉네임은 공백이 없는 영어, 숫자, 한글만 사용할 수 있습니다');
      return;
    }
    const response = await updateNickname(nickname);

    if (response?.errorCode) {
      showToast(`${response.message}`);
    } else {
      alert('성공적으로 변경되었습니다.');
      router.push('/service/mypage');
    }
  };

  return (
    <Box className="input">
      <Toast as="alert" isActive={toast} onClose={() => setToast(false)} autoClose={1500}>
        <Text>{toastMessage}</Text>
      </Toast>
      <form onSubmit={handleSubmit(handleUpdateNickname)}>
        <Flex direction="column" gap="20px">
          <div className="form_group">
            <Box className="row">
              <Text as="label" htmlFor="nickname" className="require">
                닉네임
              </Text>
              <Box className="input">
                <input
                  type="text"
                  id="nickname"
                  {...register('nickname', {
                    required: '닉네임을 입력해주세요',
                    pattern: {
                      value: /^[a-zA-Z0-9가-힣]{1,13}$/,
                      message: '닉네임은 영어, 숫자, 한글만 사용할 수 있습니다 (공백 및 특수문자 제외)',
                    },
                    maxLength: {
                      value: 13,
                      message: '닉네임은 13자 이하로 입력해주세요',
                    },
                  })}
                  disabled={isLoading}
                  placeholder="닉네임"
                  defaultValue={data?.nickname}
                  className={errors.nickname ? 'error' : ''}
                />
                {errors.nickname && (
                  <Text as="p" className="error">
                    {errors.nickname.message}
                  </Text>
                )}
              </Box>
            </Box>
          </div>
          <div className="btn_group">
            <ButtonL type="submit" style="deep" disabled={isLoading}>
              {isLoading ? '처리 중...' : '수정'}
            </ButtonL>
          </div>
        </Flex>
      </form>
    </Box>
  );
}
