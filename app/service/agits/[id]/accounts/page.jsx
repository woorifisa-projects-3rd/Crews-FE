import { ButtonM, SelectFilter, TabMenu, Title } from '@/components/common';
import {
  agitsSelectMenuList,
  monthSelectMenuList,
  orderSelectMenuList,
  tranTypeSelectMenuList,
} from '@/constants/selectMenuList/sample';
import { Box, Flex, Text } from '@radix-ui/themes';
import { accountDetail } from '@/constants/dummy';

import { tabMenuList } from '@/constants/tabMenuList/agits';
import Account from '@/components/agits/Account/Account';
import { getAccount } from '@/apis/agitsAPI';
import AccountDetail from '@/components/agits/Account/AccountDetail';
export default async function Page({ params }) {
  const [agits] = agitsSelectMenuList.filter((select) => select.id == params.id);
  const data = await getAccount(params.id);
  console.log(data);
  return (
    <div className="page">
      <header>
        <Box>
          <SelectFilter isHeader={true} as="link" pathname="/service/agits" selectList={agitsSelectMenuList}>
            {agits?.text}
          </SelectFilter>
        </Box>
        <TabMenu tabMenuList={tabMenuList} dynamicID={params.id} />
      </header>
      <Flex direction="column" gap="10px" className="content">
        <section>
          <Flex direction="column" gap="20px">
            <Title>모임통장 상세</Title>
            {data.ci == null ? <Text as="p">모임통장이 없습니다.</Text> : <Account accounts={data} />}
            <ButtonM leftButton={{ text: '권한 요청하기' }} rightButton={{ text: '회비 납부하기' }} />
          </Flex>
        </section>
        <section>
          <Flex justify="end" gap="5px">
            <SelectFilter filter="filter" selectList={monthSelectMenuList}>
              3개월
            </SelectFilter>
            <SelectFilter filter="filter" selectList={tranTypeSelectMenuList}>
              전체
            </SelectFilter>
            <SelectFilter filter="filter" selectList={orderSelectMenuList}>
              최신순
            </SelectFilter>
          </Flex>
          <Box mt="1">
            <ul>
              {accountDetail.map((detail, i) => {
                return <AccountDetail data={detail} key={`detail${i}`} />;
              })}
            </ul>
          </Box>
        </section>
      </Flex>
    </div>
  );
}
