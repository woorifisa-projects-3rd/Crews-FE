import { Header } from '@/components/common';
import { Flex } from '@radix-ui/themes';

import { products } from '@/constants/dummy';
import DepositProduct from '@/components/agits/Account/AccountCreate';

export default async function Page() {
  return (
    <div className="page">
      <header>
        <Header side="center">계좌개설</Header>
      </header>
      <Flex direction="column" gap="10px" className="content">
        <section>
          <Flex direction="column" gap="10px" asChild>
            <ul>
              {products.map((product, index) => {
                return <DepositProduct key={index} product={product}></DepositProduct>;
              })}
            </ul>
          </Flex>
        </section>
      </Flex>
    </div>
  );
}
