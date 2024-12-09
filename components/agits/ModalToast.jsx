'use client';
import { useToast } from '@/hooks';
import { ButtonM, Modal, Toast } from '../common';
import { Box, Text } from '@radix-ui/themes';
import styles from './ModalToast.module.css';
import { useForm } from 'react-hook-form';
import { reportFeed } from '@/apis/agitsAPI';

export default function ModalToast({ isOpen, closeModal, agitId, feedId }) {
  const { toast, setToast, toastMessage, showToast } = useToast();
  const onSubmit = async (data) => {
    console.log('submit data: ', data);
    const formData = {
      content: data.report,
    };
    console.log('formed data: ', formData);
    const response = await reportFeed(agitId, feedId, formData);
    if (response.errorCode === 'ALREADY_REPORTED_FEED') {
      alert('이미 신고한 피드입니다.');
      closeModal();
    } else {
      closeModal();
      showToast('신고가 완료되었습니다!');
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <>
      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        header={{ title: '해당 활동기록을 신고하시겠습니까?' }}
        footer={
          <ButtonM
            leftButton={{ text: '취소', onClick: closeModal }}
            rightButton={{ text: '신고하기', onClick: handleSubmit(onSubmit) }}
          />
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className={styles.report_box}>
          <Box className="row">
            <Text as="label" className="require">
              신고사유
            </Text>
            <Box className="input">
              <input
                id="report"
                type="text"
                placeholder="신고 사유를 적어주세요"
                {...register('report', {
                  required: '신고 사유를 적어주세요',
                  maxLength: {
                    value: 25,
                    message: '최대 25자까지만 입력할 수 있습니다.',
                  },
                })}
                className={errors.report ? 'error' : ''}
              />
            </Box>
            {errors.report && (
              <Text as="p" className="error">
                {errors.report.message}
              </Text>
            )}
          </Box>
        </form>
      </Modal>
      <Toast
        as="alert"
        isActive={toast}
        onClose={() => {
          setToast(false);
        }}
      >
        {toastMessage}
      </Toast>
    </>
  );
}
