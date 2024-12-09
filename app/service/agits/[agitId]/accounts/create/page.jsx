import { Header } from '@/components/common';
import { Flex } from '@radix-ui/themes';

import DepositProduct from '@/components/agits/Account/AccountCreate';
import { getProducts } from '@/apis/agitsAPI';

export default async function Page({ params }) {
  const products = await getProducts();
  if (products?.errorCode) {
    throw new Error(products.message);
  }
  return (
    <div className="page">
      <header>
        <Header side="center">계좌개설</Header>
      </header>
      <Flex direction="column" gap="10px" className="content">
        <section>
          <Flex direction="column" gap="10px" asChild>
            <ul>
              {products?.products.map((product, i) => {
                return <DepositProduct key={i} agitId={params.agitId} product={product}></DepositProduct>;
              })}
            </ul>
          </Flex>
        </section>
      </Flex>
    </div>
  );
}
