import { getAddresses } from '@/apis/mypageAPI';
import { Header } from '@/components/common';
import AddressForm from '@/components/mypage/form/AddressForm';
import { Flex } from '@radix-ui/themes';

export default async function page() {
  const addressData = await getAddresses();
  if (addressData?.errorCode) {
    throw new Error(addressData.message);
  }
  return (
    <div className="page">
      <Header side="center">활동지역 수정</Header>
      <div className="content">
        <section>
          <Flex direction="column" gap="10px">
            <AddressForm initialAddress={addressData} />
          </Flex>
        </section>
      </div>
    </div>
  );
}
