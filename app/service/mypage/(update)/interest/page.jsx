import { Header } from '@/components/common';
import InterestForm from '@/components/mypage/form/InterestForm';
import { getInterests } from '@/apis/mypageAPI';
import { getAllInterests } from '@/apis/utilAPI';

export default async function Page() {
  const interestData = await getInterests();
  if (interestData?.errorCode) {
    throw new Error(interestData.message);
  }

  const subjectsData = await getAllInterests();
  if (subjectsData?.errorCode) {
    throw new Error(subjectsData.message);
  }

  return (
    <div className="page">
      <Header side="center">관심사 수정</Header>
      <div className="content">
        <section>
          <InterestForm initialInterests={interestData} subjects={subjectsData.subjects} />
        </section>
      </div>
    </div>
  );
}
