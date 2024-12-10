import { getAgitAndCardInfo } from '@/apis/paymentAPI';
import { Header } from '@/components/common';
import PaymentMain from '@/components/payment/PaymentMain';

export default async function Payment() {
  const paymentData = await getAgitAndCardInfo();
  return (
    <div className="page">
      <Header side="center"> 결제</Header>
      <PaymentMain paymentData={paymentData}></PaymentMain>
    </div>
  );
}
