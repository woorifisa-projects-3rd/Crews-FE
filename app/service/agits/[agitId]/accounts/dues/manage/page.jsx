import { crewAccountDepositInfo, getCommonDues, getDuesProfile } from '@/apis/agitsAPI';
import DuesManage from '@/components/agits/Account/manage/DuesManage';

export default async function Page({ params }) {
  const yearAndMonth = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  };
  const commonDues = await getCommonDues(params.agitId);
  if (commonDues?.errorCode) {
    throw new Error(commonDues.message);
  }
  const profileDatas = await getDuesProfile(params.agitId, yearAndMonth);
  if (profileDatas?.errorCode) {
    throw new Error(profileDatas.message);
  }

  const accountDetail = await crewAccountDepositInfo(params.agitId, yearAndMonth);
  if (accountDetail?.errorCode) {
    throw new Error(accountDetail.message);
  }

  return (
    <DuesManage
      agitId={params.agitId}
      commonDues={commonDues}
      profileDatas={profileDatas}
      accountDetail={accountDetail}
    ></DuesManage>
  );
}
