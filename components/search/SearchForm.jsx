'use client';

import { Flex } from '@radix-ui/themes';
import { Header, SelectFilter } from '@/components/common';
import { searchMenu } from '@/constants/selectMenuList/searchMenuList';
import Image from 'next/image';
import styles from './SearchForm.module.css';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

export default function SearchForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const onSubmit = async ({ keyword }) => {
    router.push(`/service/search?q=${keyword}`);
  };

  return (
    <>
      <Header side="left">검색하기</Header>
      <div className="content">
        <section>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.search_form}>
            <input {...register('keyword')} type="text" id="keyword" placeholder="키워드를 입력해주세요!" />
            <button type="submit">
              <Image src="/icons/ico_search.svg" width={15} height={15} alt="검색하기" />
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
